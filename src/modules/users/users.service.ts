import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(dto: UserDto) {
        const newUser = new this.userModel(dto);

        await newUser.save();

        return newUser;
    }

    async getUserById(id: string) {
        return await this.userModel.findById(id).exec();
    }

    async checkUserUnicity(data?: { email?: string; username?: string }) {
        return await this.userModel.findOne(data).exec();
    }
}
