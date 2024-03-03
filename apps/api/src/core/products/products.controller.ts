import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
import { ProductOwnerGuard } from './guards/product-owner.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|svg|tiff|webp|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: 1000000 })
        .build({ fileIsRequired: true }),
    )
    image: Express.Multer.File,
  ) {
    console.log(req.user, `want to create product`);
    return this.productsService.create(createProductDto, req, image);
  }

  @UseGuards(JwtGuard)
  @Get()
  getAll(@Request() req) {
    console.log(req.user, `want to get all products`);
    return this.productsService.getAll();
  }

  @Get(':id')
  findBydId(@Param('id') id: string, @Request() req) {
    console.log(req.user, `want to get product with id: `, id);
    return this.productsService.findById(id);
  }

  @UseGuards(JwtGuard, ProductOwnerGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Request() req,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    console.log(req.user, `want to update product with id: `, id);
    return await this.productsService.update(id, updateProductDto);
  }

  @UseGuards(JwtGuard, ProductOwnerGuard)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    console.log(req.user, `want to delete product with id: `, id);
    return this.productsService.deleteById(id);
  }
}
