export class CreateRepairDTO {
  constructor(
    public readonly date: Date,
    public readonly userId: any,
    public readonly motorsNumber: string,
    public readonly description: string,
  ) { }

  static create(object: { [key: string]: any }): [string?, CreateRepairDTO?] {
    const { date, userId,motorsNumber ,description } = object;
    // Validaciones
    if (!date) return ["⚠️ Missing date 📅🚫"];

    if (!userId) return ["⚠️ User ID must be provided 🚫"];
    // Si todo está bien, devolvemos la instancia del DTO
    return [
      undefined,
      new CreateRepairDTO(date, userId,motorsNumber, description)
    ];
  }

}

