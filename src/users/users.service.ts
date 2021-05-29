import { CrudService } from "../common/crud.service";
import { User, UserDocument } from "./users.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { AuthService } from "../auth/auth.service";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
export class UsersService extends CrudService<
  User,
  CreateUserInput,
  UpdateUserInput
> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {
    super(userModel);
  }

  async create(createDto: CreateUserInput): Promise<User> {
    createDto.password = await this.authService.createPassword(
      createDto.password,
    );
    delete createDto.confirmPassword;

    const user = new this.userModel(createDto);
    return await user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return await super.findOne({ email });
  }
}
