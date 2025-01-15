import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        
        const req = ctx.switchToHttp().getRequest();

        const user = req.user;
        
        if (!user)
            throw new InternalServerErrorException('User not found (request)');
        // si no existe la data, mandame el usuario si no, mandame el user data
        return (!data) ? user: user[data];
    }
);