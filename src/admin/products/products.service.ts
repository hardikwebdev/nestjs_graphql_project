import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { Products } from 'src/database/entities/product.entity';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductInput } from './dto/createProduct.input';
import { HelperService } from 'src/helper.service';
import { AwsService } from 'src/aws/aws.service';
import { UpdateProductInput } from './dto/updateProduct.input';
import { ListProductInputType } from './dto/listProduct.input';
import {
  ExchangeOrReturnRequestType,
  IS_RETURNED_OR_EXCHANGED,
  REQUEST_STATUS,
  SORT_ORDER,
} from 'src/constants';
import { UserCartDetails } from 'src/database/entities/cart.entity';
import { ListPurchaseHistoryInputType } from './dto/listPurchaseHistory.input';
import { Orders } from 'src/database/entities/orders.entity';
import {
  OrderDetails,
  ShippingStatus,
} from 'src/database/entities/order_details.entity';
import { ExchangeReturnRequest } from 'src/database/entities/exchange_return_request.entity';
import { ListExchangeReturnRequestsInputType } from './dto/listExchangeReturnRequest.input';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRespository: Repository<Products>,
    private readonly helperService: HelperService,
    private readonly awsService: AwsService,
    @Inject('USER_CART_DETAILS_REPOSITORY')
    private readonly userCartDetailsRepository: Repository<UserCartDetails>,
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Orders>,
    @Inject('ORDER_DETAILS_REPOSITORY')
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @Inject('EXCHANGE_RETURN_REQUESTS_REPOSITORY')
    private readonly exchangeReturnRequestRepository: Repository<ExchangeReturnRequest>,
  ) { }

  /**
   * Find product by id
   * @param id
   * @returns
   */
  async findProductById(id: number) {
    const product = await this.productRespository.findOne({ where: { id } });
    if (!product) {
      throw new GraphQLError('Product not found!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }
    return product;
  }

  /**
   * Update product data by id
   * @param id
   * @param productData
   */
  async updateProductData(id: number, productData: Partial<Products>) {
    await this.productRespository.update(
      {
        id,
      },
      productData,
    );
  }
  /**
   * Delete product by id
   * @param id
   * @returns
   */
  async deleteProduct(id: number) {
    await this.findProductById(id);

    await this.userCartDetailsRepository.softDelete({
      product_id: id,
    });
    await this.productRespository.update(id, {
      deletedAt: new Date(),
      // imageUrlData: null,
    });
    return { message: 'Product deleted successfully!' };
  }

  /**
   * Create product
   * @param product
   * @returns
   */
  async createProduct(product: CreateProductInput) {
    const productImages: string[] = [];
    const { title, description, imageUrl, price, quantity } = product;
    await Promise.allSettled(
      imageUrl.map(async (imageString: string) => {
        if (this.helperService.isBase64(imageString)) {
          const uploadedImage = await this.awsService.uploadToAWS(
            'product',
            imageString,
            'prod',
          );
          productImages.push(uploadedImage.Location);
        }
      }),
    );
    const images: any = JSON.stringify(productImages);
    await this.productRespository.insert({
      title,
      description,
      imageUrlData: images,
      price,
      quantity,
    });
    return { message: 'Product created successfully!' };
  }

  /**
   * Update product by id
   * @param updateProductData
   * @param id
   * @returns
   */

  async updateProduct(updateProductData: UpdateProductInput, id: number) {
    const productImages: string[] = [];
    const {
      description,
      imageUrl,
      price,
      quantity,
      removedImageUrls,
      status,
      title,
    } = updateProductData;
    await Promise.allSettled(
      removedImageUrls.map(async (removedImageUrl: string) => {
        try {
          await this.awsService.removeFromBucket(removedImageUrl);
        } catch (error) {
          console.error('Error removing image:', error);
        }
      }),
    );

    await Promise.all(
      imageUrl.map(async (imageString: string) => {
        if (this.helperService.isBase64(imageString)) {
          try {
            const uploadedImage = await this.awsService.uploadToAWS(
              'product',
              imageString,
              'prod',
            );
            productImages.push(uploadedImage.Location);
            return;
          } catch (error) {
            console.error('Error uploading image:', error);
          }
        } else {
          productImages.push(imageString);
        }
      }),
    );
    await this.updateProductData(id, {
      title,
      description,
      price,
      quantity,
      status,
      imageUrlData: JSON.stringify(productImages),
    });
    return { message: 'Product updated successfully!' };
  }

  /**
   * Get product with pagination and sorting
   * @param listProductInputType
   * @returns
   */
  async getProducts(listProductInputType: ListProductInputType) {
    const { page, pageSize, sortBy } = listProductInputType;
    const sortOrder: any = listProductInputType.sortOrder;
    const skip = (page - 1) * pageSize;

    const queryBuilder: SelectQueryBuilder<Products> = this.productRespository
      .createQueryBuilder('products')
      .skip(skip)
      .take(pageSize)
      .orderBy(
        `products.${sortBy}`,
        SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
      );

    if (listProductInputType.search) {
      queryBuilder.andWhere(
        '(products.title LIKE :title OR products.price = :price OR products.description LIKE :description)',
        {
          title: `%${listProductInputType.search}%`,
          description: `%${listProductInputType.search}%`,
          price: listProductInputType.search,
        },
      );
    }

    if (
      listProductInputType.status === 0 ||
      listProductInputType.status === 1
    ) {
      queryBuilder.andWhere('(products.status = :status)', {
        status: listProductInputType.status,
      });
    }

    const [products, total] = await queryBuilder.getManyAndCount();
    return { products, total };
  }

  /**
   * Update product status
   * @param id
   * @param status
   */
  async updateProductStatus(id: number, status: number) {
    await this.findProductById(id);
    await this.updateProductData(id, { status });
    return { message: 'Product status updated successfully!' };
  }

  /**
   * Get all purchase history of products
   * @param listPurchaseHistoryInput
   * @returns
   */
  async getPurchaseHistoryOfProducts(
    listPurchaseHistoryInput: ListPurchaseHistoryInputType,
  ) {
    const { page, pageSize, sortBy } = listPurchaseHistoryInput;
    const sortOrder: any = listPurchaseHistoryInput.sortOrder;
    const skip = (page - 1) * pageSize;
    let convertedDate: string | undefined;
    if (listPurchaseHistoryInput.date) {
      convertedDate = listPurchaseHistoryInput.date.replace(/\//g, '-');
    }
    const queryBuilder: SelectQueryBuilder<OrderDetails> =
      this.orderDetailsRepository
        .createQueryBuilder('orderDetails')
        .leftJoinAndSelect('orderDetails.order', 'order')
        .leftJoinAndSelect('orderDetails.product', 'product')
        .leftJoinAndSelect('order.user', 'user')
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `orderDetails.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        )
        .andWhere(
          new Brackets((qb) => {
            if (listPurchaseHistoryInput.search) {
              qb.where(
                '(product.title LIKE :search OR product.description LIKE :search OR user.firstname LIKE :search OR user.lastname LIKE :search)',
                { search: `%${listPurchaseHistoryInput.search}%` },
              );
            }

            if (
              listPurchaseHistoryInput.is_returned === 1 ||
              listPurchaseHistoryInput.is_returned === 0
            ) {
              qb.andWhere('(orderDetails.is_returned = :is_returned)', {
                is_returned: listPurchaseHistoryInput.is_returned,
              });
            }
            if (
              listPurchaseHistoryInput.is_exchanged === 1 ||
              listPurchaseHistoryInput.is_exchanged === 0
            ) {
              qb.andWhere('(orderDetails.is_exchanged = :is_exchanged)', {
                is_exchanged: listPurchaseHistoryInput.is_exchanged,
              });
            }
            if (listPurchaseHistoryInput.shipping_status) {
              qb.andWhere('orderDetails.shipping_status = :shipping_status', {
                shipping_status: listPurchaseHistoryInput.shipping_status,
              });
            }
            if (convertedDate) {
              qb.andWhere('DATE(orderDetails.createdAt) = :date', {
                date: convertedDate,
              });
            }
          }),
        )
        .select([
          'orderDetails.id',
          'orderDetails.createdAt',
          'orderDetails.updatedAt',
          'orderDetails.is_returned',
          'orderDetails.is_exchanged',
          'orderDetails.order_id',
          'orderDetails.price',
          'orderDetails.product_id',
          'orderDetails.quantity',
          'orderDetails.shipping_status',
          'order.id',
          'order.total_price',
          'order.user_id',
          'order.payment_status',
          'user.id',
          'user.firstname',
          'user.lastname',
          'user.email',
          'product.id',
          'product.title',
          'product.description',
        ]);

    const [orderDetails, total] = await queryBuilder.getManyAndCount();

    return { orderDetails, total };
  }

  /**
   * Update Shipping status
   * @param order_details_id
   * @param shipping_status
   * @returns
   */
  async updateShippingStatus(
    order_details_id: number,
    shipping_status: ShippingStatus,
  ) {
    if (!Object.values(ShippingStatus).includes(shipping_status)) {
      throw new GraphQLError('Please choose correct shipping status!', {
        extensions: {
          statusCode: HttpStatus.BAD_REQUEST,
        },
      });
    }
    await this.orderDetailsRepository.update(
      { id: order_details_id },
      { shipping_status: shipping_status },
    );
    return { message: 'Shipping status has been updated successfully!' };
  }

  /**
   * Approve or Reject Exchange Return Requests of product
   * @param exchange_return_request_id
   * @param status
   * @returns
   */
  async approveOrRejectExchangeReturnRequest(
    exchange_return_request_id: number,
    status: number,
  ) {
    const exchangeReturnRequest =
      await this.exchangeReturnRequestRepository.findOne({
        where: { id: exchange_return_request_id },
      });

    if (!exchangeReturnRequest) {
      throw new GraphQLError('No Request found with this ID!', {
        extensions: {
          statusCode: HttpStatus.NOT_FOUND,
        },
      });
    }

    await this.exchangeReturnRequestRepository.update(
      { id: exchangeReturnRequest.id },
      { status: status },
    );
    const request_type = exchangeReturnRequest.request_type;
    if (status === REQUEST_STATUS.APPROVED) {
      if (request_type === ExchangeOrReturnRequestType.EXCHANGE) {
        await this.orderDetailsRepository.update(
          { id: exchangeReturnRequest.order_details_id },
          { is_exchanged: IS_RETURNED_OR_EXCHANGED.TRUE },
        );
      }
      if (request_type === ExchangeOrReturnRequestType.RETURN) {
        await this.orderDetailsRepository.update(
          { id: exchangeReturnRequest.order_details_id },
          { is_returned: IS_RETURNED_OR_EXCHANGED.TRUE },
        );
      }
    }

    return {
      message: `Product ${request_type.charAt(0).toUpperCase()}${request_type.slice(1).toLowerCase()} request has been ${REQUEST_STATUS[status]} successfully!`,
    };
  }

  /**
   * Get all Exchange Return Requests for products
   * @param listPurchaseHistoryInput
   * @returns
   */
  async getAllExchangeReturnRequestsOfProduct(
    listExchangeReturnRequestsInput: ListExchangeReturnRequestsInputType,
  ) {
    const { page, pageSize, sortBy } = listExchangeReturnRequestsInput;
    const sortOrder: any = listExchangeReturnRequestsInput.sortOrder;
    const skip = (page - 1) * pageSize;
    let convertedDate: string | undefined;
    if (listExchangeReturnRequestsInput.date) {
      convertedDate = listExchangeReturnRequestsInput.date.replace(/\//g, '-');
    }
    const queryBuilder: SelectQueryBuilder<ExchangeReturnRequest> =
      this.exchangeReturnRequestRepository
        .createQueryBuilder('exchangeReturn')
        .leftJoinAndSelect('exchangeReturn.orderDetails', 'orderDetails')
        .leftJoinAndSelect('orderDetails.product', 'product')
        .leftJoinAndSelect('exchangeReturn.users', 'users')
        .skip(skip)
        .take(pageSize)
        .orderBy(
          `exchangeReturn.${sortBy}`,
          SORT_ORDER.includes(sortOrder) ? sortOrder.toUpperCase() : 'DESC',
        )
        .andWhere(
          new Brackets((qb) => {
            if (listExchangeReturnRequestsInput.search) {
              qb.where(
                '(users.firstname LIKE :search OR users.lastname LIKE :search OR product.title LIKE :search OR product.description LIKE :search)',
                { search: `%${listExchangeReturnRequestsInput.search}%` },
              );
            }
            if (listExchangeReturnRequestsInput.status) {
              qb.andWhere('exchangeReturn.status = :status', {
                status: listExchangeReturnRequestsInput.status,
              });
            }
            if (convertedDate) {
              qb.andWhere('DATE(exchangeReturn.createdAt) = :date', {
                date: convertedDate,
              });
            }
          }),
        )
        .select([
          'exchangeReturn.id',
          'exchangeReturn.order_details_id',
          'exchangeReturn.status',
          'exchangeReturn.user_id',
          'exchangeReturn.request_type',
          'exchangeReturn.createdAt',
          'exchangeReturn.updatedAt',
          'orderDetails.id',
          'orderDetails.createdAt',
          'orderDetails.updatedAt',
          'orderDetails.is_returned',
          'orderDetails.is_exchanged',
          'orderDetails.order_id',
          'orderDetails.price',
          'orderDetails.product_id',
          'orderDetails.quantity',
          'orderDetails.shipping_status',
          'users.id',
          'users.firstname',
          'users.lastname',
          'users.email',
          'product.id',
          'product.title',
          'product.description',
        ]);

    const [exchangeReturnRequests, total] =
      await queryBuilder.getManyAndCount();
    return { exchangeReturnRequests, total };
  }
}
