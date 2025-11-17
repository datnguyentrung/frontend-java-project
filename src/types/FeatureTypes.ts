export interface Feature {
    idFeature: string;
    basicInfo: BasicInfo;
}

export interface BasicInfo {
    featureGroup: string;
    featureName: string;
    iconComponent: string;
    enabled: boolean;
    roles: string[];
}