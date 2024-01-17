export interface IValidityResponse {
    validity_start: string;
    validity_end: string;
}

export interface IStateResponse {
    state_id: number;
    state_description: string;
}

// [CR] proč je něco camelCase a něco snake_case?
export interface ISecuredCardResponse {
    cardValidityEnd: string;
    state_id: number;
    state_description: string;
}
