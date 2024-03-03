import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ProductsService } from '../products.service';

@Injectable()
export class ProductOwnerGuard implements CanActivate {
  constructor(private readonly productService: ProductsService) {}
  /**
   * Check if the user is the owner of the post.
   *
   * @return {Promise<boolean>} A promise that resolves to a boolean indicating if the user is the owner of the post.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestingUserId = request.user;
    const requestedProductId = request.params.id;

    const isOwner = await this.productService.isOwnerProduct(
      requestedProductId,
      requestingUserId,
    );

    if (!isOwner) {
      throw new ForbiddenException('You are not the owner of this product');
    }
    return true;
  }
}
