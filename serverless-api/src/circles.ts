import {createResponse, LambdaHandler, parseJSON} from "./common";
import {v1 as uuid} from "uuid";
import {
    Circle,
    CircleMembership,
    getCircleById,
    getCircleMembershipsByUserId,
    saveCircle,
    saveCircleMembership
} from "./repository/circles";


export interface CircleDTO extends Circle {
    members: string[]
}

export const getById: LambdaHandler = async (event, context) => {

    if (!event.pathParameters || !event.pathParameters.circleId) {
        return createResponse(400, { message: "Missing path parameter" });
    }

    const circle = await getCircleById(event.pathParameters.circleId);
    if (!circle) {
        return createResponse(404, { message: "No circle with that id" });
    }

    return createResponse(200, circle);
};

export const getCirclesForUser: LambdaHandler = async (event, context) => {
    const circleMemberships = await getCircleMembershipsByUserId(event.requestContext.authorizer.userId);
    const circles = await Promise.all(circleMemberships.map(m => getCircleById(m.circleId)));
    return createResponse(200, circles);
};

export const post: LambdaHandler = async (event, context) => {
    if (!event.body) {
        return createResponse(400, { error: "Missing body" });
    }
    const body = parseJSON(event.body) as Partial<Circle>;
    const { circleName, image } = body;

    if (!circleName) {
        return createResponse(400, {error: "Missing circleName"})
    }


    const circleId = uuid();
    const newCircle: Circle = {
        circleId,
        circleName,
    };
    const newCircleMembership: CircleMembership = {
        circleMembershipId: uuid(),
        circleId,
        userId: event.requestContext.authorizer.userId
    };
    if (image) {
        newCircle.image = image;
    }

    const circle = await saveCircle(newCircle);
    const circleMembership = await saveCircleMembership(newCircleMembership);

    const circleDTO: CircleDTO = {
        ...circle, members: [circleMembership.userId]
    };

    return createResponse(200, circleDTO);
};
