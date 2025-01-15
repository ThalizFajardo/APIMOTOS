import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../../domain";
import { UpdateUserDTO } from "../../domain/dtos/updateUser.dto";
import { CustomError } from "../../domain";

export class UserController {
  constructor(private readonly userService: UserService) { }


  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    console.log(error);
    return res.status(500).json({ message: "Something went very wrong! 🧨" });
  };




  findAllUser = (req: Request, res: Response) => {
    this.userService
      .findAll()
      .then((data) => res.status(201).json(data))
      .catch((error: any) => { this.handleError(error, res) });
  };


  findOneUser = (req: Request, res: Response) => {
    const { id } = req.params;

    this.userService
      .findOne(id)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res))
  };

  createUser = (req: Request, res: Response) => {
    const [error, createUserDTO] = CreateUserDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });

    this.userService
      .create(createUserDTO!)
      .then((data) => res.status(201).json(data))
      .catch((error: any) => { this.handleError(error, res) });
  }



  updateUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateUserDTO] = UpdateUserDTO.create(req.body);

    if (error) return res.status(422).json({ message: error });
    this.userService
      .update(id, updateUserDTO!)
      .then((data) => res.status(200).json(data))
      .catch((error: any) => this.handleError(error, res))

  }


  deleteUser = (req: Request, res: Response) => {
    const { id } = req.params;
    const [error, updateUserDTO] = UpdateUserDTO.create(req.body);

    this.userService
      .delete(id,updateUserDTO!)
      .then((data) => res.status(204).json(data))
      .catch((error: any) => this.handleError(error, res))
  }

}

