declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
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

  type BaseResponseQuestionVO_ = {
    code?: number;
    data?: QuestionVO;
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

  type getQuestionByIdUsingGET1Params = {
    /** questionId */
    questionId: number;
  };

  type getQuestionByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionSubmitByIdUsingGETParams = {
    /** questionSubmitId */
    questionSubmitId: number;
  };

  type getQuestionVOByIdUsingGETParams = {
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

  type ModelAndView = {
    empty?: boolean;
    model?: Record<string, any>;
    modelMap?: Record<string, any>;
    reference?: boolean;
    status?:
      | "CONTINUE"
      | "SWITCHING_PROTOCOLS"
      | "PROCESSING"
      | "CHECKPOINT"
      | "OK"
      | "CREATED"
      | "ACCEPTED"
      | "NON_AUTHORITATIVE_INFORMATION"
      | "NO_CONTENT"
      | "RESET_CONTENT"
      | "PARTIAL_CONTENT"
      | "MULTI_STATUS"
      | "ALREADY_REPORTED"
      | "IM_USED"
      | "MULTIPLE_CHOICES"
      | "MOVED_PERMANENTLY"
      | "FOUND"
      | "MOVED_TEMPORARILY"
      | "SEE_OTHER"
      | "NOT_MODIFIED"
      | "USE_PROXY"
      | "TEMPORARY_REDIRECT"
      | "PERMANENT_REDIRECT"
      | "BAD_REQUEST"
      | "UNAUTHORIZED"
      | "PAYMENT_REQUIRED"
      | "FORBIDDEN"
      | "NOT_FOUND"
      | "METHOD_NOT_ALLOWED"
      | "NOT_ACCEPTABLE"
      | "PROXY_AUTHENTICATION_REQUIRED"
      | "REQUEST_TIMEOUT"
      | "CONFLICT"
      | "GONE"
      | "LENGTH_REQUIRED"
      | "PRECONDITION_FAILED"
      | "PAYLOAD_TOO_LARGE"
      | "REQUEST_ENTITY_TOO_LARGE"
      | "URI_TOO_LONG"
      | "REQUEST_URI_TOO_LONG"
      | "UNSUPPORTED_MEDIA_TYPE"
      | "REQUESTED_RANGE_NOT_SATISFIABLE"
      | "EXPECTATION_FAILED"
      | "I_AM_A_TEAPOT"
      | "INSUFFICIENT_SPACE_ON_RESOURCE"
      | "METHOD_FAILURE"
      | "DESTINATION_LOCKED"
      | "UNPROCESSABLE_ENTITY"
      | "LOCKED"
      | "FAILED_DEPENDENCY"
      | "TOO_EARLY"
      | "UPGRADE_REQUIRED"
      | "PRECONDITION_REQUIRED"
      | "TOO_MANY_REQUESTS"
      | "REQUEST_HEADER_FIELDS_TOO_LARGE"
      | "UNAVAILABLE_FOR_LEGAL_REASONS"
      | "INTERNAL_SERVER_ERROR"
      | "NOT_IMPLEMENTED"
      | "BAD_GATEWAY"
      | "SERVICE_UNAVAILABLE"
      | "GATEWAY_TIMEOUT"
      | "HTTP_VERSION_NOT_SUPPORTED"
      | "VARIANT_ALSO_NEGOTIATES"
      | "INSUFFICIENT_STORAGE"
      | "LOOP_DETECTED"
      | "BANDWIDTH_LIMIT_EXCEEDED"
      | "NOT_EXTENDED"
      | "NETWORK_AUTHENTICATION_REQUIRED";
    view?: View;
    viewName?: string;
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

  type QuestionSubmit = {
    code?: string;
    createTime?: string;
    id?: number;
    isDelete?: number;
    judgeInfo?: string;
    language?: string;
    questionId?: number;
    status?: number;
    updateTime?: string;
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

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type View = {
    contentType?: string;
  };
}
