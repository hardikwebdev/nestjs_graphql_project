import { Args, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from './products.service';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { UseGuards } from '@nestjs/common';
import { JwtAdminAuthGuard } from 'src/guards/admin_guard/admin_jwt.guard';
import { CreateProductInput } from './dto/createProduct.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { ListProductInputType } from './dto/listProduct.input';
import { ListProductObjectType } from './dto/listProduct.object';
import { Products } from 'src/database/entities/product.entity';
import { ListPurchaseHistoryObjectType } from './dto/listPurchaseHistory.object';
import { ListPurchaseHistoryInputType } from './dto/listPurchaseHistory.input';
import { ShippingStatus } from 'src/database/entities/order_details.entity';
import { ListExchangeReturnRequestsObjectType } from './dto/listExchangeReturnRequests.object';
import { ListExchangeReturnRequestsInputType } from './dto/listExchangeReturnRequest.input';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productService: ProductService) {}

  /**
   * Dete product by id
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminDeleteProduct(@Args('id', { type: () => ID! }) id: number) {
    return await this.productService.deleteProduct(id);
  }

  /**
   * Create product by admin user
   * @param createProduct
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminCreateProduct(
    @Args('createProductInput') createProduct: CreateProductInput,
  ) {
    return await this.productService.createProduct(createProduct);
  }

  /**
   * Update product by id by admin user
   * @param createProduct
   * @param id
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateProduct(
    @Args('updateProductInput') updateProduct: UpdateProductInput,
    @Args('id', { type: () => ID! }) id: number,
  ) {
    return await this.productService.updateProduct(updateProduct, id);
  }

  /**
   * Get products with pagination and sorting
   * @param listProductInputType
   * @returns
   */
  @Query(() => ListProductObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminListProducts(
    @Args('listProductInputType') listProductInputType: ListProductInputType,
  ) {
    return await this.productService.getProducts(listProductInputType);
  }

  /**
   * Get products with pagination and sorting
   * @param listProductInputType
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateProductStatus(
    @Args('id', { type: () => ID! }) id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.productService.updateProductStatus(id, status);
  }

  /**
   * Get Product by id
   * @param id
   * @returns
   */
  @Query(() => Products)
  @UseGuards(JwtAdminAuthGuard)
  async adminGetProductById(@Args('id', { type: () => ID! }) id: number) {
    return await this.productService.findProductById(id);
  }

  /**
   * Get all purchase history of products
   * @param listPurchaseHistoryInputType
   * @returns
   */
  @Query(() => ListPurchaseHistoryObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminListPurchaseHistoryOfProducts(
    @Args('listPurchaseHistoryInputType')
    listPurchaseHistoryInputType: ListPurchaseHistoryInputType,
  ) {
    return await this.productService.getPurchaseHistoryOfProducts(
      listPurchaseHistoryInputType,
    );
  }

  /**
   * Update Shipping status
   * @param order_details_id
   * @param shipping_status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateShippingStatusOfOrder(
    @Args('order_details_id', { type: () => ID! }) order_details_id: number,
    @Args('shipping_status')
    shipping_status: ShippingStatus,
  ) {
    return await this.productService.updateShippingStatus(
      order_details_id,
      shipping_status,
    );
  }

  /**
   * Approve or Reject Exchange Return Requests of product
   * @param exchange_return_request_id
   * @param status
   * @returns
   */
  @Mutation(() => MessageObject)
  @UseGuards(JwtAdminAuthGuard)
  async adminUpdateExchangeReturnRequestStatus(
    @Args('exchange_return_request_id', { type: () => ID! })
    exchange_return_request_id: number,
    @Args('status', { type: () => Int! }) status: number,
  ) {
    return await this.productService.approveOrRejectExchangeReturnRequest(
      exchange_return_request_id,
      status,
    );
  }

  /**
   * Get all Exchange Return Requests for products
   * @param listExchangeReturnRequestsInputType
   * @returns
   */
  @Query(() => ListExchangeReturnRequestsObjectType)
  @UseGuards(JwtAdminAuthGuard)
  async adminListExchangeReturnRequestsOfProduct(
    @Args('listExchangeReturnRequestsInputType')
    listExchangeReturnRequestsInputType: ListExchangeReturnRequestsInputType,
  ) {
    return await this.productService.getAllExchangeReturnRequestsOfProduct(
      listExchangeReturnRequestsInputType,
    );
  }
}
