type BaseResponseStatus = "Success" | "Error";

type ClanJoinStatus = BaseResponseStatus | "AlreadyInClan" | "NotInGroup";
type ClanCreationStatus = BaseResponseStatus | "AlreadyExists" | "AlreadyInClan" | "NotAllowed";
type ClanDepositStatus = BaseResponseStatus | "NotInClan" | "InsufficientBalance";
type ClanWithdrawStatus = BaseResponseStatus | "NotInClan" | "InsufficientBalance" | "NotAllowed";
