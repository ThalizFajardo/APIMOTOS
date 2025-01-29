import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { RegisterUserDTO } from "../../domain/dtos/users/registerUser.dto";
import { UpdateUserDTO } from "../../domain/dtos/users/updateUser.dto";
import { LoginUserDto } from "../../domain/dtos/users/loginUser.dto";
import { CustomError } from "../../domain";
import { error } from "console";
import { protectAccountOwner } from "../../config/validateOwner";



export class UserController {
  constructor(private readonly userService: UserService) { }


  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
    .login(loginUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  }

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .register(registerUserDto!)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  validateAccount = (req: Request, res: Response) => {
    const { token } = req.params;

    this.userService
      .validateEmail(token)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));
  };

  getProfile = (req: Request, res: Response) => {
    this.userService
      .getUserProfile(req.body.sessionUser)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));

  }

  blockAccount = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService
      .blockAccount(id)
      .then((data) => res.status(200).json(data))
      .catch((error) => this.handleError(error, res));

  }

  findOneUser = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService
      .findOne(id)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res))
  };

  findAllUser = (req: Request, res: Response) => {
    this.userService
      .findAll()
      .then((data) => res.status(201).json(data))
      .catch((error: any) => { this.handleError(error, res) });
  };


  // createUser = (req: Request, res: Response) => {
  //   const [error, createUserDTO] = CreateUserDTO.create(req.body);

  //   if (error) return res.status(422).json({ message: error });

  //   this.userService
  //     .create(createUserDTO!)
  //     .then((data) => res.status(201).json(data))
  //     .catch((error: any) => { this.handleError(error, res) });
  // }

  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateUserDTO] = UpdateUserDTO.create(req.body);
    const sessionUserId = req.body.sessionUser.id;

    if (!protectAccountOwner(id, sessionUserId)) {
      return res.status(401).json({ message: "You are not the owner of this account"});
    }

    if (error) return res.status(422).json({ message: error });
    this.userService
      .update(id, updateUserDTO!)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res))

  }


  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateUserDTO] = UpdateUserDTO.create(req.body);
    const sessionUserId = req.body.sessionUserId.id;

    if (!protectAccountOwner(id, sessionUserId)) {
      return res.status(401).json({ message: "You are not the owner of this account" });
    }

    this.userService
      .delete(id, updateUserDTO!)
      .then((data) => res.status(204).json(data))
      .catch((error: any) => this.handleError(error, res))
  }

}

