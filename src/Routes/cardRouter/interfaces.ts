export interface IValidityResponse {
    validity_start: string;
    validity_end: string;
}

export interface IStateResponse {
    state_id: number;
    state_description: string;
}

export interface ISecuredCardResponse {
    cardValidityEnd: string;
    state_id: number;
    state_description: string;
}
