export class Notification {
    id!: string;
    userId!: string | number;
    type!: string;
    message!: string;
    createdAt!: Date;
    isRead!: boolean;
}