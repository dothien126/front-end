export interface IBrowseResponse {
    bd: BdFieldOfBrowseResponse[];
}

export interface BdFieldOfBrowseResponse{
    _content: string;
    freq: number;
    h: string;
}