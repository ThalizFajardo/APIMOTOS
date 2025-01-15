export class CreateRepairDTO {
  constructor(
    public readonly date: Date,
    public readonly userId: any,
  ) {}

  static create(object: { [key: string]: any }): [string?, CreateRepairDTO?] {
    const { date, userId } = object;

   

    // Validaciones
    if (!date)return ["Missing date"];

    if (!userId)
       return ["El ID de usuario debe ser ingresado"];

    // Si todo está bien, devolvemos la instancia del DTO
    return [
      undefined,
      new CreateRepairDTO(date, userId)
    ];
  }

}

