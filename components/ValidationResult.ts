export class ValidationResult{
    public errors: Message[]
    public warnings: Message[]
    public infos: Message[]
}

export class Message {
    message: string;
    statusCode: string;
    field: string;
}