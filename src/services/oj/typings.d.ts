declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponsePageQuestion_ = {
    code?: number;
    data?: PageQuestion_;
    message?: string;
  };

  type BaseResponsePageQuestionSubmitVO_ = {
    code?: number;
    data?: PageQuestionSubmitVO_;
    message?: string;
  };

  type BaseResponsePageQuestionVO_ = {
    code?: number;
    data?: PageQuestionVO_;
    message?: string;
  };

  type BaseResponsePageQuestionWithSubmitStatusVO_ = {
    code?: number;
    data?: PageQuestionWithSubmitStatusVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponseQuestionVO_ = {
    code?: number;
    data?: QuestionVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type DebugSubmitRequest = {
    code?: string;
    inputList?: string[];
    language?: string;
    sid?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type getQuestionVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type JudgeCase = {
    input?: string;
    output?: string;
  };

  type JudgeConfig = {
    memoryLimit?: number;
    stackLimit?: number;
    timeLimit?: number;
  };

  type JudgeInfo = {
    memory?: number;
    message?: string;
    time?: number;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: number;
    token?: string;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Question[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionSubmitVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionSubmitVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionWithSubmitStatusVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionWithSubmitStatusVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Question = {
    acceptedNum?: number;
    answer?: string;
    content?: string;
    createTime?: string;
    difficulty?: number;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    judgeCase?: string;
    judgeConfig?: string;
    submitNum?: number;
    tags?: string;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionAddRequest = {
    answer?: string;
    content?: string;
    difficulty?: number;
    judgeCase?: JudgeCase[];
    judgeConfig?: JudgeConfig;
    tags?: string[];
    title?: string;
  };

  type QuestionQueryRequest = {
    answer?: string;
    content?: string;
    current?: number;
    difficulty?: number;
    id?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type QuestionSubmitAddRequest = {
    code?: string;
    language?: string;
    questionId?: number;
    sid?: string;
  };

  type QuestionSubmitQueryRequest = {
    current?: number;
    language?: string;
    pageSize?: number;
    questionId?: number;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    userId?: number;
  };

  type QuestionSubmitVO = {
    code?: string;
    createTime?: string;
    id?: number;
    judgeInfo?: JudgeInfo;
    language?: string;
    questionId?: number;
    questionVO?: QuestionVO;
    status?: number;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type QuestionUpdateRequest = {
    answer?: string;
    content?: string;
    difficulty?: number;
    id?: number;
    judgeCase?: JudgeCase[];
    judgeConfig?: JudgeConfig;
    tags?: string[];
    title?: string;
  };

  type QuestionVO = {
    acceptedNum?: number;
    content?: string;
    createTime?: string;
    difficulty?: number;
    favourNum?: number;
    id?: number;
    judgeConfig?: JudgeConfig;
    submitNum?: number;
    tags?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type QuestionWithSubmitStatusVO = {
    acceptedNum?: number;
    content?: string;
    createTime?: string;
    difficulty?: number;
    favourNum?: number;
    id?: number;
    judgeConfig?: JudgeConfig;
    submitNum?: number;
    submitStatus?: number;
    tags?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    mpOpenId?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type userLoginByWxOpenUsingGETParams = {
    /** code */
    code: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
