import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { ListProductInputType } from 'src/admin/products/dto/listProduct.input';
import {
  CART_ITEM_STATUS,
  PaymentStatus,
  SORT_ORDER,
  STATUS,
} from 'src/constants';
import { Products } from 'src/database/entities/product.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserCartDetails } from 'src/database/entities/cart.entity';
import { AddToCartInput } from './dto/addCart.input';
import { UpdateCartInput } from './dto/updateCart.object';
import { StripeService } from 'src/stripe/stripe.service';
import Stripe from 'stripe';
import { Orders } from 'src/database/entities/orders.entity';
import {
  OrderDetails,
  ShippingStatus,
} from 'src/database/entities/order_details.entity';
import { ListOrderDetailsInput } from './dto/listOrderDetails.input';
import { Users } from 'src/database/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: Repository<Products>,
    @Inject('USER_CART_DETAILS_REPOSITORY')
    private readonly userCartDetailsRepository: Repository<UserCartDetails>,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Orders>,
    @Inject('ORDER_DETAILS_REPOSITORY')
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<Users>,
    private readonly stripeService: StripeService,
  ) { }

  /**
   * Get Products List with Search, Sorting and Pagination and also get user total cart number
   * @param getProductsData
   * @param userId
   * @returns
   */
  async getProductsList(getProductsData: ListProductInputType, userId: number) {
    const { page, pageSize, sortBy } = getProductsData;
    const sortOrder: any = getProductsData.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<Products> = this.productRepository
      .createQueryBuilder('products')
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `products.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );

    if (getProductsData.search) {
      queryBuilder.andWhere(
        '(products.title LIKE :title OR products.price = :price)',
        {
          title: `%${getProductsData.search}%`,
          price: getProductsData.search,
        },
      );
    }

    queryBuilder.andWhere('(products.status = :status)', {
      status: STATUS.ACTIVE,
    });
    const userCartData = await this.userCartDetailsRepository.count({
      where: {
        status: CART_ITEM_STATUS.PENDING,
        user_id: userId,
      },
    });
    const [products, total] = await queryBuilder.getManyAndCount();

    return { products, total, totat_cart_items: userCartData };
  }

  /**
   * Get Products details by ID
   * @param productId
   * @returns
   */
  async getProductDetailsById(productId: number) {
    const isProductExist = await this.getProductById(productId);

    if (!isProductExist) {
      throw new GraphQLError('Product not found', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    return isProductExist;
  }

  async getProductById(id: number) {
    return await this.productRepository.findOneBy({
      id,
      status: STATUS.ACTIVE,
    });
  }

  /**
   * Add to cart
   * @param AddToCartInput
   * @returns
   */
  async addToCart(cartData: AddToCartInput, user_id: number) {
    const userCartDetails = await this.userCartDetailsRepository.findOne({
      where: {
        user_id,
        product_id: cartData.product_id,
        status: CART_ITEM_STATUS.PENDING,
      },
    });

    const isProductQuantityExist = await this.getProductById(
      cartData.product_id,
    );
    if (!isProductQuantityExist) {
      throw new GraphQLError('Product not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    let usertotalQty: number = cartData.quantity;
    if (userCartDetails) {
      usertotalQty += userCartDetails.quantity;
    }

    if (!(isProductQuantityExist.quantity >= usertotalQty)) {
      throw new GraphQLError('Product quantity not available!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    if (userCartDetails) {
      userCartDetails.quantity = usertotalQty;
      await this.userCartDetailsRepository.save(userCartDetails);
    } else {
      await this.userCartDetailsRepository.insert({
        product_id: cartData.product_id,
        quantity: cartData.quantity,
        user_id,
      });
    }

    return { message: 'Product added to the cart successfully!' };
  }

  /**
   * Remove product from cart
   * @param ID
   * @returns
   */
  async removeFromCart(cart_ids: number[]) {
    await this.userCartDetailsRepository
      .createQueryBuilder()
      .update(UserCartDetails)
      .set({ deletedAt: new Date() })
      .where(
        'id IN (:...cart_ids) AND status = :status AND deletedAt IS NULL',
        {
          cart_ids,
          status: CART_ITEM_STATUS.PENDING,
        },
      )
      .execute();

    return { message: 'Product removed from cart successfully!' };
  }

  /**
   * Update quantity of product in cart
   * @param UpdateCartInput
   * @returns
   */
  async updateCartQuantity(cartData: UpdateCartInput, cart_id: number) {
    const cart_details = await this.findCartDetailById(cart_id);
    if (!cart_details) {
      throw new GraphQLError('Cart details not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const isProductQuantityExist = await this.getProductById(
      cart_details.product_id,
    );
    if (!isProductQuantityExist) {
      throw new GraphQLError('Product not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    if (!(isProductQuantityExist.quantity >= cartData.quantity)) {
      throw new GraphQLError('Product quantity not available!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }

    await this.updateCartDetails(cart_id, cartData);
    return { message: 'Product quantity updated successfully!' };
  }

  /**
   * Update cart data by id
   * @param id
   * @param cartData
   */
  async updateCartDetails(id: number, cartData: Partial<UserCartDetails>) {
    await this.userCartDetailsRepository.update(
      {
        id,
      },
      cartData,
    );
  }

  /**
   * Find cart details by id
   * @param id
   * @returns
   */
  async findCartDetailById(id: number) {
    const cart = await this.userCartDetailsRepository.findOneBy({
      id,
      status: CART_ITEM_STATUS.PENDING,
    });
    if (!cart) {
      throw new GraphQLError('Cart details not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return cart;
  }

  /**
   * Get Cart List with Search
   * @returns
   */
  async getAllCartList(user_id: number) {
    const queryBuilder: SelectQueryBuilder<UserCartDetails> =
      this.userCartDetailsRepository
        .createQueryBuilder('user_cart_details')
        .leftJoin('user_cart_details.products', 'products')
        .leftJoin('user_cart_details.users', 'users')
        .where(
          'user_cart_details.user_id = :user_id AND user_cart_details.status = :status',
          { user_id, status: CART_ITEM_STATUS.PENDING },
        )
        .addSelect([
          'user_cart_details.id',
          'user_cart_details.quantity',
          'user_cart_details.product_id',
          'user_cart_details.user_id',
          'products.title',
          'products.description',
          'products',
          'users.firstname',
          'users.lastname',
          'users.email',
        ]);

    const [cart_details, total] = await queryBuilder.getManyAndCount();

    return {
      cart_details,
      total,
      message: 'Cart details fetched successfully!',
    };
  }

  /**
   * check payment and create order with order details
   * @param paymentIntentId
   * @returns
   */
  async checkPaymentAndCreateOrder(paymentIntentId: string) {
    const paymentIntent: Stripe.Response<Stripe.PaymentIntent> =
      await this.stripeService.retrievePaymentIntent(paymentIntentId);
    return await this.checkPaymentIntentAndCreateOrder(paymentIntent);
  }

  /**
   * check payment intent and create order details
   * @param paymentIntent
   * @returns
   */
  async checkPaymentIntentAndCreateOrder(paymentIntent: Stripe.PaymentIntent) {
    const cartData = paymentIntent.metadata['cart_ids'];
    const userId = paymentIntent.metadata['user_id'];
    const cartIds: number[] = JSON.parse(cartData);
    if (cartIds.length === 0 || !userId) {
      throw new GraphQLError('Invalid metadata!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const user = await this.userRepository.findOneBy({
      id: Number(userId),
    });

    if (!user) {
      throw new GraphQLError('User not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    const findOrder = await this.findOrderByData({
      payment_intent_id: paymentIntent.id,
      user_id: Number(userId),
    });

    if (paymentIntent.status === 'canceled') {
      if (findOrder) {
        await this.updateOrderById(findOrder.id, {
          payment_status: PaymentStatus.CANCELED,
        });
        await this.updateOrderDetailsByData(
          {
            order_id: findOrder.id,
          },
          { shipping_status: ShippingStatus.CANCELED },
        );
        return { message: 'Your payment has been cancelled!' };
      }
      const order = await this.createOrder({
        total_price: paymentIntent.amount / 100,
        user_id: Number(userId),
        payment_intent_id: paymentIntent.id,
        payment_intent_data: JSON.stringify(paymentIntent),
        payment_status: PaymentStatus.CANCELED,
      });
      for await (const id of cartIds) {
        const cart = await this.findCartWithProductDetails(id, undefined);
        if (!cart) {
          return;
        }
        const orderDetails: Partial<OrderDetails> = {
          order_id: order.id,
          price: cart.products.price * cart.quantity,
          quantity: cart.quantity,
          shipping_status: ShippingStatus.CANCELED,
          product_id: cart.product_id,
        };
        await this.createOrderDetail(orderDetails);
      }
      return { message: 'Your payment has been cancelled!' };
    } else if (paymentIntent.status === 'succeeded') {
      let order = findOrder;
      if (findOrder && findOrder.payment_status === 'succeeded') {
        return { message: 'Your order has been placed successfully!' };
      }
      if (findOrder && findOrder.payment_status === 'processing') {
        await this.updateOrderById(findOrder.id, {
          payment_status: PaymentStatus.SUCCEEDED,
        });
        return { message: 'Your order has been placed successfully!' };
      }
      if (!findOrder) {
        order = await this.createOrder({
          total_price: paymentIntent.amount_received / 100,
          user_id: Number(userId),
          payment_intent_id: paymentIntent.id,
          payment_intent_data: JSON.stringify(paymentIntent),
          payment_status: PaymentStatus.SUCCEEDED,
        });
      }
      for await (const id of cartIds) {
        const cart = await this.findCartWithProductDetails(id, undefined);
        if (!cart) {
          return;
        }
        const orderDetails: Partial<OrderDetails> = {
          order_id: order.id,
          price: cart.products.price * cart.quantity,
          quantity: cart.quantity,
          product_id: cart.product_id,
        };
        await this.updateProductById(cart.products.id, {
          quantity: cart.products.quantity - cart.quantity,
        });
        await this.createOrderDetail(orderDetails);
        await this.updateCartDetails(id, {
          status: CART_ITEM_STATUS.ORDERED,
        });
      }
      return { message: 'Your order has been placed successfully!' };
    } else if (paymentIntent.status === 'processing') {
      if (!findOrder) {
        await this.checkForProcessingPayment(
          findOrder,
          paymentIntent,
          userId,
          cartIds,
        );
      }
      return { message: 'Your order details will be updated soon!' };
    }
    return { message: 'Your order details will be updated soon!' };
  }

  /**
   * create order for processing payment intent
   * @param findOrder
   * @param paymentIntent
   * @param userId
   * @param cartIds
   * @returns
   */
  async checkForProcessingPayment(
    findOrder: Orders,
    paymentIntent: Stripe.PaymentIntent,
    userId: any,
    cartIds: number[],
  ) {
    if (!findOrder) {
      const order = await this.createOrder({
        total_price: paymentIntent.amount / 100,
        user_id: Number(userId),
        payment_intent_id: paymentIntent.id,
        payment_intent_data: JSON.stringify(paymentIntent),
        payment_status: PaymentStatus.PROCESSING,
      });
      for await (const id of cartIds) {
        const cart = await this.findCartWithProductDetails(id, undefined);
        if (!cart) {
          return;
        }
        const orderDetails: Partial<OrderDetails> = {
          order_id: order.id,
          price: cart.products.price * cart.quantity,
          quantity: cart.quantity,
          product_id: cart.product_id,
        };
        await this.createOrderDetail(orderDetails);
        await this.updateCartDetails(id, {
          status: CART_ITEM_STATUS.PROCESSING,
        });
      }
    }
    return { message: 'Your order details will be updated soon' };
  }

  /**
   * find order by data
   * @param whereOptions
   * @returns
   */
  async findOrderByData(whereOptions: Partial<Orders>) {
    return await this.orderRepository.findOneBy(whereOptions);
  }

  /**
   * create order
   * @param orderData
   * @returns
   */
  async createOrder(orderData: Partial<Orders>) {
    return await this.orderRepository.save(orderData);
  }

  /**
   * create order
   * @param orderData
   * @returns
   */
  async createOrderDetail(orderData: Partial<OrderDetails>) {
    return await this.orderDetailsRepository.save(orderData);
  }

  /**
   * Update order
   * @param orderData
   * @returns
   */
  async updateOrderById(id: number, updateData: Partial<Orders>) {
    return await this.orderRepository.update(id, updateData);
  }

  /**
   * Update order details
   * @param orderData
   * @returns
   */
  async updateOrderDetailsByData(
    data: Partial<OrderDetails>,
    updateData: Partial<OrderDetails>,
  ) {
    return await this.orderDetailsRepository.update(data, updateData);
  }

  /**
   * find cart details with product details
   * @param id
   * @returns
   */
  async findCartWithProductDetails(id: number, status: number) {
    return await this.userCartDetailsRepository.findOne({
      where: {
        id,
        ...(status && status !== undefined && { status }),
      },
      relations: {
        products: true,
      },
    });
  }

  /**
   * update product by id
   * @param id
   * @param updateData
   * @returns
   */
  async updateProductById(id: number, updateData: Partial<Products>) {
    return await this.productRepository.update(id, updateData);
  }

  /**
   * check cart details with product quantity
   * @returns
   */
  async checkCartDetailsWithQuantity(cart_ids: number[]) {
    try {
      const unavailable_cart_products = [];
      for await (const id of cart_ids) {
        const cart = await this.findCartWithProductDetails(
          id,
          CART_ITEM_STATUS.PENDING,
        );
        if (!cart) {
          throw new GraphQLError('Cart not found!', {
            extensions: {
              statusCode: HttpStatus.NOT_FOUND,
            },
          });
        }
        if (cart?.quantity > cart?.products?.quantity) {
          unavailable_cart_products.push(cart.id);
        }
      }
      return unavailable_cart_products;
    } catch (error) {
      throw new GraphQLError(error, {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
  }

  /**
   * get order details with pagination
   * @param orderDetailsInput
   */
  async getOrderWithPagination(
    orderDetailsInput: ListOrderDetailsInput,
    userId: number,
  ) {
    const { page, pageSize, sortBy, search } = orderDetailsInput;
    const sortOrder: any = orderDetailsInput.sortOrder;
    const skip = (page - 1) * pageSize;
    const queryBuilder: SelectQueryBuilder<Orders> = this.orderRepository
      .createQueryBuilder('orders')
      .withDeleted()
      .where('orders.user_id = :userId', {
        userId,
      })
      .leftJoin('orders.orderDetails', 'orderDetails')
      .andWhere('orderDetails.deletedAt IS NULL')
      .leftJoinAndSelect('orderDetails.product', 'product')
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `orders.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      )
      .select([
        'orders.id',
        'orders.total_price',
        'orders.payment_status',
        'orders.createdAt',
        'orderDetails.id',
        'orderDetails.price',
        'orderDetails.order_id',
        'orderDetails.quantity',
        'orderDetails.product_id',
        'product.id',
        'product.title',
        'product.description',
        'product.imageUrlData',
      ]);
    if (search) {
      queryBuilder.andWhere(
        'orders.total_price = :price OR orderDetails.price = :price OR product.title LIKE :search OR product.description LIKE :search',
        {
          price: search,
          search: `%${search}%`,
        },
      );
      queryBuilder.andWhere('orderDetails.deletedAt IS NULL');
    }
    queryBuilder.andWhere('orders.deletedAt IS NULL');
    const [orders, total] = await queryBuilder.getManyAndCount();
    return { orders, total };
  }
}
