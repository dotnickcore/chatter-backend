import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity"

const getCurrentUserByContext = (context: ExecutionContext): User | undefined => {
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest().user;
    } else if (context.getType<GqlContextType>() === 'graphql') {
        return GqlExecutionContext.create(context).getContext().req.user;
    }

    return undefined; // Add a fallback return value to avoid the TypeScript error
};

export const CurrentUser = createParamDecorator(
    (_data: unknown, context: ExecutionContext) => 
        getCurrentUserByContext(context),
);