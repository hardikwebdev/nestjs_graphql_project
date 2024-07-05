import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ListProductObjectType } from 'src/admin/products/dto/listProduct.object';
import { ListProductInputType } from 'src/admin/products/dto/listProduct.input';
import { UseGuards } from '@nestjs/common';
import { JwtParentAuthGuard } from 'src/guards/parent_guard/parent_jwt.guard';
import { Products } from 'src/database/entities/product.entity';
import { ListCartDetailsObject } from './dto/listCartDetails.object';
import { AddToCartInput } from './dto/addCart.input';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { UpdateCartInput } from './dto/updateCart.object';
import { UserCartDetails } from 'src/database/entities/cart.entity';
import { ListOrderDetailsInput } from './dto/listOrderDetails.input';
import { ListOrderDetailsObject } from './dto/listOrderDetails.object';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productService: ProductsService) {}

  /**
   * Get Products list with Search, Sorting and Pagination
   * @param getProductsInput
   * @returns
   */
  @Query(() => ListProductObjectType)
  @UseGuards(JwtParentAuthGuard)
  async getProductsList(
    @Args('getProductsInputType') getProductsInput: ListProductInputType,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return await this.productService.getProductsList(getProductsInput, userId);
  }

  /**
   * Get Product by Id
   * @param id
   * @returns
   */
  @Query(() => Products)
  @UseGuards(JwtParentAuthGuard)
  async getProductDetailsById(@Args('id', { type: () => ID! }) id: number) {
    return await this.productService.getProductDetailsById(id);
  }

  /**
   * Add Product to Cart
   * @param CartInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async addToCart(
    @Args('input') input: AddToCartInput,
    @Context() context: any,
  ) {
    const user_id = context.req.user.id;
    return await this.productService.addToCart(input, user_id);
  }

  /**
   * Remove Product to Cart
   * @param CartInput
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async removeFromCart(@Args('cart_ids', { type: () => [ID]! }) ids: number[]) {
    return await this.productService.removeFromCart(ids);
  }

  /**
   * Update cart details by id
   * @param UpdateCartInput
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async updateQuantityToCart(
    @Args('updateCartInput') updateCartQuantity: UpdateCartInput,
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.productService.updateCartQuantity(updateCartQuantity, id);
  }

  /**
   * Get Cart details by id
   * @param id
   * @returns
   */
  @Query(() => UserCartDetails)
  @UseGuards(JwtParentAuthGuard)
  async getCartDetailsById(@Args('id', { type: () => ID! }) id: number) {
    return await this.productService.findCartDetailById(id);
  }

  /**
   * Get Cart list
   * @returns
   */
  @Query(() => ListCartDetailsObject)
  @UseGuards(JwtParentAuthGuard)
  async getAllCartList(@Context() context: any) {
    const user_id = context.req.user.id;
    return await this.productService.getAllCartList(user_id);
  }

  /**
   * Check cart product quantity exist or not while checkout cart
   * @param cart_ids
   * @returns
   */
  @Query(() => [Int])
  @UseGuards(JwtParentAuthGuard)
  async verifyCartDetailsOnCheckout(
    @Args('cart_ids', { type: () => [ID!] }) cart_ids: any[],
  ) {
    return await this.productService.checkCartDetailsWithQuantity(cart_ids);
  }

  /**
   * Check payment, create order and order details
   * @param id
   * @returns
   */
  @Query(() => MessageObject)
  @UseGuards(JwtParentAuthGuard)
  async checkPaymentAndCreateOrder(
    @Args('id', { type: () => String! }) id: string,
  ) {
    return await this.productService.checkPaymentAndCreateOrder(id);
  }

  /**
   * Get order details of user
   * @returns
   */
  @Query(() => ListOrderDetailsObject)
  @UseGuards(JwtParentAuthGuard)
  async getAllOrderDetailsOfUser(
    @Args('orderDetailsInput') orderDetailsInput: ListOrderDetailsInput,
    @Context() context: any,
  ) {
    const userId = context.req.user.id;
    return await this.productService.getOrderWithPagination(
      orderDetailsInput,
      userId,
    );
  }
}
