import { Scalar, CustomScalar } from '@nestjs/graphql';
import { Kind, type ValueNode } from 'graphql';

/** Niestandardowy skalar GraphQL dla typów JSON */
@Scalar('JSON', () => Object)
export class JsonScalar implements CustomScalar<any, any> {
    description = 'JSON custom scalar';

    parseValue(value: unknown): unknown {
        return value;
    }

    serialize(value: unknown): unknown {
        return value;
    }

    parseLiteral(ast: ValueNode): unknown {
        if (ast.kind === Kind.STRING) {
            return JSON.parse(ast.value);
        }
        return null;
    }
}
