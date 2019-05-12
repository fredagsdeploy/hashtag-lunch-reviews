import {dynamodb} from "./documentClient";
import {CircleDTO} from "../circles";

export interface Circle {
    circleId: string;
    circleName: string;
    image?: string;
}

export interface CircleMembership {
    circleMembershipId: string;
    circleId: string;
    userId: string;
}

const CIRCLE_TABLE = "Circles";
const CIRCLE_MEMBERSHIP_TABLE = "CircleMemberships";

export const getCircleById = async (
    circleId: string
): Promise<Circle | undefined> => {
    const getParams = {
        TableName: CIRCLE_TABLE,
        Key: {
            circleId
        }
    };
    const circleResp = await dynamodb.get(getParams).promise();
    const circle = circleResp.Item as CircleDTO;
    if (!circle) {
        return undefined;
    }

    const members = await getCircleMembershipsByCircleId(circleId);
    circle.members = members.map(membership => membership.userId);

    return circle as Circle | undefined;
};

export const getCircleMembershipsByCircleId = async (circleId: string): Promise<CircleMembership[]> => {
    const params = {
        TableName: CIRCLE_MEMBERSHIP_TABLE,
        Select: "ALL_ATTRIBUTES",
        IndexName: "circleMembershipCircleIdIndex",
        KeyConditionExpression: "circleId = :circleId",
        ExpressionAttributeValues: { ":circleId": circleId }
    };
    const res = await dynamodb.query(params).promise();
    if (!res.Items || !res.Items[0]) {
        return [];
    }

    return res.Items as CircleMembership[];
};

export const getCircleMembershipsByUserId = async (userId: string): Promise<CircleMembership[]> => {
    const params = {
        TableName: CIRCLE_MEMBERSHIP_TABLE,
        Select: "ALL_ATTRIBUTES",
        IndexName: "circleMembershipUserIdIndex",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: { ":userId": userId }
    };

    const res = await dynamodb.query(params).promise();
    if (!res.Items || !res.Items[0]) {
        return [];
    }

    return res.Items as CircleMembership[]
};

export const saveCircle = async (circleInput: Circle): Promise<Circle> => {
    const params = {
        TableName: CIRCLE_TABLE,
        Item: circleInput
    };

    await dynamodb.put(params).promise();
    const circle = await getCircleById(circleInput.circleId);

    return circle!;
};


export const getCircleMembershipById = async (
    circleMembershipId: string
): Promise<CircleMembership | undefined> => {
    const getParams = {
        TableName: CIRCLE_MEMBERSHIP_TABLE,
        Key: {
            circleMembershipId
        }
    };
    const circleMembership = await dynamodb.get(getParams).promise();

    return circleMembership.Item as CircleMembership | undefined;
};


export const saveCircleMembership = async (membershipInput: CircleMembership): Promise<CircleMembership> => {
    const params = {
        TableName: CIRCLE_MEMBERSHIP_TABLE,
        Item: membershipInput
    };

    await dynamodb.put(params).promise();
    const circleMembership = await getCircleMembershipById(membershipInput.circleMembershipId);

    return circleMembership!;
};