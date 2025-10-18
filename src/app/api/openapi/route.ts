import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    "openapi": "3.0.0",
    "info": {
      "title": "电商数据中台API",
      "version": "1.0.0",
      "description": "智能体数据中台API文档"
    },
    "servers": [
      {
        "url": "http://localhost:3000",
        "description": "本地开发服务器"
      }
    ],
    "paths": {
      "/api/dify/orders": {
        "get": {
          "summary": "查询订单",
          "description": "查询订单信息，支持按站点、客户、日期等条件筛选",
          "operationId": "getOrders",
          "parameters": [
            {
              "name": "site",
              "in": "query",
              "description": "站点名称 (zenbreeze/sogoodtea)",
              "required": false,
              "schema": {
                "type": "string",
                "enum": ["zenbreeze", "sogoodtea"]
              }
            },
            {
              "name": "customer_email",
              "in": "query",
              "description": "客户邮箱",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "start_date",
              "in": "query",
              "description": "开始日期 (YYYY-MM-DD)",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "end_date",
              "in": "query",
              "description": "结束日期 (YYYY-MM-DD)",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "status",
              "in": "query",
              "description": "订单状态",
              "required": false,
              "schema": {
                "type": "string",
                "enum": ["completed", "pending", "processing"]
              }
            },
            {
              "name": "limit",
              "in": "query",
              "description": "返回数量 (默认50)",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 50
              }
            }
          ],
          "responses": {
            "200": {
              "description": "成功返回订单列表",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object"
                        }
                      },
                      "count": {
                        "type": "integer"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/dify/customers": {
        "get": {
          "summary": "查询客户",
          "description": "查询客户信息，支持按站点、标签、生命周期价值等条件筛选",
          "operationId": "getCustomers",
          "parameters": [
            {
              "name": "site",
              "in": "query",
              "description": "站点名称 (zenbreeze/sogoodtea)",
              "required": false,
              "schema": {
                "type": "string",
                "enum": ["zenbreeze", "sogoodtea"]
              }
            },
            {
              "name": "email",
              "in": "query",
              "description": "邮箱搜索",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "tags",
              "in": "query",
              "description": "客户标签",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "min_lifetime_value",
              "in": "query",
              "description": "最小生命周期价值",
              "required": false,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "limit",
              "in": "query",
              "description": "返回数量 (默认50)",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 50
              }
            }
          ],
          "responses": {
            "200": {
              "description": "成功返回客户列表",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object"
                        }
                      },
                      "count": {
                        "type": "integer"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "/api/dify/products": {
        "get": {
          "summary": "查询产品",
          "description": "查询产品信息，支持按站点、分类、价格等条件筛选",
          "operationId": "getProducts",
          "parameters": [
            {
              "name": "site",
              "in": "query",
              "description": "站点名称 (zenbreeze/sogoodtea)",
              "required": false,
              "schema": {
                "type": "string",
                "enum": ["zenbreeze", "sogoodtea"]
              }
            },
            {
              "name": "name",
              "in": "query",
              "description": "产品名称",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "category",
              "in": "query",
              "description": "产品分类",
              "required": false,
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "min_price",
              "in": "query",
              "description": "最低价格",
              "required": false,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "max_price",
              "in": "query",
              "description": "最高价格",
              "required": false,
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "in_stock",
              "in": "query",
              "description": "是否有库存",
              "required": false,
              "schema": {
                "type": "boolean"
              }
            },
            {
              "name": "limit",
              "in": "query",
              "description": "返回数量 (默认50)",
              "required": false,
              "schema": {
                "type": "integer",
                "default": 50
              }
            }
          ],
          "responses": {
            "200": {
              "description": "成功返回产品列表",
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "success": {
                        "type": "boolean"
                      },
                      "data": {
                        "type": "array",
                        "items": {
                          "type": "object"
                        }
                      },
                      "count": {
                        "type": "integer"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return NextResponse.json(openApiSpec);
}
