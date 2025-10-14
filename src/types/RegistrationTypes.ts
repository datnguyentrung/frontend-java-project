export interface PersonalInfo {
    name: string;
    birthDate: Date;
    phone: string;
    referredBy: string;
}

export interface RegistrationInfo {
    idBranch: number;
    idClassSession: string[];
    beltLevel: string;
    registrationDate?: Date;
    registrationStatus?: string; // REGISTERED, TRIAL, ENROLLED, COMPLETED
}

export interface RegistrationDTO {
    idRegistration: string;
    personalInfo: PersonalInfo;
    registrationInfo: RegistrationInfo;
}