import {createResponse, LambdaHandler, parseJSON} from "./common";
import {v1 as uuid} from "uuid";
import {
    Circle,
    CircleMembership,
    getCircleById,
    getCircleMembershipsByUserId, isUserMemberOfCircle,
    saveCircle,
    saveCircleMembership
} from "./repository/circles";
import {getUserById} from "./repository/users";


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

export const postCircleMembership: LambdaHandler = async (event, context) => {
    if (!event.pathParameters || !event.pathParameters.circleId) {
        return createResponse(400, {error: "Missing path parameter"})
    }

    const circleMembership = parseJSON(event.body) as Partial<CircleMembership>;
    if (!circleMembership.userId) {
        return createResponse(400, {error: "Missing userId in body"})
    }

    if (!await getUserById(circleMembership.userId)) {
        return createResponse(400, {error: `No user with id ${circleMembership.userId}`})
    }


    const circleId = event.pathParameters.circleId;
    if (!isUserMemberOfCircle(event.requestContext.authorizer.userId, circleId)) {
        return createResponse(400, {error: "The user trying to add a circle membership is not part of the circle being added to."})
    }


    const newMembership = await saveCircleMembership(createCircleMembership(circleMembership.userId, circleId));
    return createResponse(200, newMembership);
};

const createCircleMembership = (userId: string, circleId: string): CircleMembership => {
    return {
        circleMembershipId: uuid(),
        circleId,
        userId
    };
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
    const newCircleMembership: CircleMembership = createCircleMembership(circleId, event.requestContext.authorizer.userId);
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
