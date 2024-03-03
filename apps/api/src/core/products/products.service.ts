import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateUniqueKeyFile } from 'src/lib/generate-unique-key-file';
import * as schema from 'src/schemas';
import { AwsService } from '../aws/aws.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(schema.Product.name)
    private productModel: Model<schema.Product>,
    private readonly awsService: AwsService,
  ) {}
  async create(
    createProductDto: CreateProductDto,
    req,
    image: Express.Multer.File,
  ) {
    const uniqueKeyFileName = await generateUniqueKeyFile(
      image.originalname,
      req.user.username,
    );

    const imageLocation = await this.awsService.uploadToS3(
      uniqueKeyFileName,
      image.buffer,
      image.mimetype,
    );
    const newProduct = await new this.productModel({
      ...createProductDto,
      imageUrl: imageLocation.Location,
      averageRating: 5,
      owner: req.user.id,
    }).save();

    return await newProduct.toObject();
  }

  async getAll() {
    return this.productModel.find().exec();
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const productUpdate = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    return productUpdate;
  }

  async deleteById(id: string) {
    const productDeleted = await this.productModel
      .findByIdAndDelete(id, { new: true })
      .exec();
    return productDeleted;
  }

  async isOwnerProduct(id: string, user): Promise<boolean> {
    const requestedProduct = await this.productModel.findById(id).exec();
    return requestedProduct.owner.toString() === user.id;
  }
}
