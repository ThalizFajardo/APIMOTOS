import { regularExp } from "../../../config/regular-exp";
import { Role } from "../../../data";


export class UpdateUserDTO {
  constructor(
    public name: string,
    public email: string,
    public password: string,
  ) {}

  static create(object: { [key: string]: any }): [string?, UpdateUserDTO?] {
    const { name, email, password } = object;

    if (!name) return ["⚠️ Missing name 🚫"];
    if (!email) return ["⚠️ Missing email 📧🚫"];
    if (!regularExp.password.test(password))
      return [
        "⚠️ The password must be at least 10 characters long and include at least one uppercase letter, one lowercase letter, and one special character 🔒",
      ];
      if(!Role)return["Missing role"];
     
    return [
      undefined,
      new UpdateUserDTO(name , email, password),
    ];
  }

}

