export const demoData = [
    {
      "component": "group_component",
      "icon": "",
      "id": 27875,
      "integrationId": 14,
      "key": "cloudflare-group",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70403,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "CDN / WAF"
          },
          "viewId": 6,
          "viewRecordId": 27883
        }
      ],
      "order": 0,
      "parentId": "",
      "type": ""
    },
    {
      "component": "group_component",
      "icon": "",
      "id": 27875,
      "integrationId": 14,
      "key": "services-group",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70403,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "K8S Cluster"
          },
          "viewId": 6,
          "viewRecordId": 27883
        }
      ],
      "order": 1,
      "parentId": "",
      "type": ""
    },
    {
      "component": "group_component",
      "icon": "",
      "id": 27875,
      "integrationId": 14,
      "key": "cloud-group",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70403,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "Cloud Services"
          },
          "viewId": 6,
          "viewRecordId": 27883
        }
      ],
      "order": 1,
      "parentId": "",
      "type": ""
    },
    {
      "component": "group_component",
      "icon": "",
      "id": 27875,
      "integrationId": 14,
      "key": "egress-group",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70403,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "3rd Party Services"
          },
          "viewId": 6,
          "viewRecordId": 27883
        }
      ],
      "order": 2,
      "parentId": "",
      "type": ""
    },
    {
      "component": "element_component",
      "icon": "/icons/cloudflare.svg",
      "id": 27875,
      "integrationId": 14,
      "key": "cloudflare-service",
      "layout": [
        {
          "createdAt": "2025-03-19T00:34:52.707982Z",
          "id": 70273,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T00:34:52.707982Z",
          "value": {
            "data": "cloudflare"
          },
          "viewId": 6,
          "viewRecordId": 27875
        },
        {
          "createdAt": "2025-03-19T00:34:52.707982Z",
          "id": 70279,
          "label": "Status",
          "selector": ".value // [] | {     success: map(         select(             .status.phase == \"Running\" and              (.status.containerStatuses // [] | all(.state.running != null))         )     ) | length,     pending: map(select(.status.phase == \"Pending\")) | length,     failed: map(         select(             .status.phase == \"Failed\" or             (.status.phase == \"Running\" and               (.status.containerStatuses // [] | any(.state.running == null)))         )     ) | length }",
          "selectorType": "k8s-pod",
          "type": "status",
          "updatedAt": "2025-03-19T00:34:52.707982Z",
          "value": {
            "data": {
              "failed": 0,
              "pending": 0,
              "success": 1
            }
          },
          "viewId": 6,
          "viewRecordId": 27875
        },
        {
          "createdAt": "2025-03-19T00:34:52.707982Z",
          "id": 70346,
          "label": "",
          "selector": "[{\"url\": \"https://grafana.com/#\", \"icon\": \"/icons/grafana.svg\", \"label\": \"Grafana\"}, {\"url\": \"https://argo-cd.readthedocs.io/en/stable/#\", \"icon\": \"/icons/argo-cd.svg\", \"label\": \"Argo CD\"}, {\"url\": \"https://github.com\", \"icon\": \"/icons/github.svg\", \"label\": \"GitHub\"}]",
          "selectorType": "record",
          "type": "links",
          "updatedAt": "2025-03-19T00:34:52.707982Z",
          "value": {
            "data": [
              {
                "icon": "/icons/grafana.svg",
                "label": "Grafana",
                "url": "https://grafana.com/#"
              }
            ]
          },
          "viewId": 6,
          "viewRecordId": 27875
        },
        {
          "createdAt": "2025-03-19T00:35:12.707982Z",
          "id": 70348,
          "label": "Error Rate",
          "selector": ".metrics.errors | { value: (.total / .requests * 100) | round(2), change: ((.rate - .previous_rate) | round(2)) }",
          "selectorType": "cloudflare",
          "type": "progress",
          "updatedAt": "2025-03-19T00:35:12.707982Z",
          "value": {
            "data": 0.87
          },
          "viewId": 6,
          "viewRecordId": 27875
        },
        {
          "createdAt": "2025-03-19T00:35:12.707982Z",
          "id": 70350,
          "label": "Cache Hit Ratio",
          "selector": ".metrics.cache | { value: (.hits / (.hits + .misses) * 100) | round(1), change: (((.hits / (.hits + .misses)) - (.previous_hits / (.previous_hits + .previous_misses))) * 100) | round(1) }",
          "selectorType": "cloudflare",
          "type": "inversed_progress",
          "updatedAt": "2025-03-19T00:35:12.707982Z",
          "value": {
            "data": 82.4
          },
          "viewId": 6,
          "viewRecordId": 27875
        },
        {
          "createdAt": "2025-03-19T00:35:12.707982Z",
          "id": 70352,
          "label": "Blocked Requests",
          "selector": ".metrics.security | { value: .threats_blocked, change: ((.threats_blocked - .previous_threats_blocked) / .previous_threats_blocked * 100) | round }",
          "selectorType": "cloudflare",
          "type": "text",
          "updatedAt": "2025-03-19T00:35:12.707982Z",
          "value": {
            "data": "0.01"
          },
          "viewId": 6,
          "viewRecordId": 27875
        }
      ],
      "order": 0,
      "parentId": "cloudflare-group",
      "type": "cloudflare-service"
    },
    {
      "component": "element_component",
      "icon": "/icons/postgresql.svg",
      "id": 27876,
      "integrationId": 15,
      "key": "postgres-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70380,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "postgres-db"
          },
          "viewId": 6,
          "viewRecordId": 27876
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70471,
          "label": "CPU Usage",
          "selector": ".metrics.resources | { value: (.cpu_used_percent), change: ((.cpu_used_percent - .previous_cpu_used_percent)) | round(1) }",
          "selectorType": "postgres",
          "type": "progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 42.3
          },
          "viewId": 6,
          "viewRecordId": 27876
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70470,
          "label": "Memory Usage",
          "selector": ".metrics.resources | { value: (.memory_used_mb / .memory_allocated_mb * 100) | round(1), change: (((.memory_used_mb / .memory_allocated_mb) - (.previous_memory_used_mb / .previous_memory_allocated_mb)) * 100) | round(1) }",
          "selectorType": "postgres",
          "type": "progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 68.5
          },
          "viewId": 6,
          "viewRecordId": 27876
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70381,
          "label": "Connections",
          "selector": ".metrics.connections | { value: .current, change: ((.current - .previous) / .previous * 100) | round(1) }",
          "selectorType": "postgres",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "92"
          },
          "viewId": 6,
          "viewRecordId": 27876
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70383,
          "label": "Role",
          "selector": ".status.role",
          "selectorType": "postgres",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "reader/writer"
          },
          "viewId": 6,
          "viewRecordId": 27876
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70384,
          "label": "Replication Lag",
          "selector": ".metrics.replication | { value: .lag_seconds, change: ((.lag_seconds - .previous_lag_seconds) / .previous_lag_seconds * 100) | round(1) }",
          "selectorType": "postgres",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "1.5 ms"
          },
          "viewId": 6,
          "viewRecordId": 27876
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        }
      ],
      "order": 1,
      "parentId": "cloud-group",
      "type": "postgres-service"
    },
    {
      "component": "element_component",
      "icon": "/icons/gcp.svg",
      "id": 27877,
      "integrationId": 16,
      "key": "cloud-func-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70390,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "Cloud Functions"
          },
          "viewId": 6,
          "viewRecordId": 27877
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70391,
          "label": "Status",
          "selector": ".status | { active: .active_functions, errors: .error_count }",
          "selectorType": "gcp-functions",
          "type": "status",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": {
              "active": 8,
              "errors": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27877
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70490,
          "label": "Total Invocations",
          "selector": ".metrics.invocations | { value: .count, change: ((.rate - .previous_rate) / .previous_rate * 100) | round(1) }",
          "selectorType": "gcp-functions",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "12,540"
          },
          "viewId": 6,
          "viewRecordId": 27877
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70491,
          "label": "Average Execution Time",
          "selector": ".metrics.performance | { value: .avg_execution_ms, change: ((.avg_execution_ms - .previous_avg_execution_ms) / .previous_avg_execution_ms * 100) | round(1) }",
          "selectorType": "gcp-functions",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "245ms"
          },
          "viewId": 6,
          "viewRecordId": 27877
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70492,
          "label": "Memory Usage",
          "selector": ".metrics.resources | { value: (.memory_used_mb / .memory_allocated_mb * 100) | round(1), change: (((.memory_used_mb / .memory_allocated_mb) - (.previous_memory_used_mb / .previous_memory_allocated_mb)) * 100) | round(1) }",
          "selectorType": "gcp-functions",
          "type": "progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 42.8
          },
          "viewId": 6,
          "viewRecordId": 27877
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70493,
          "label": "Error Rate",
          "selector": ".metrics.errors | { value: ((.count / .total_invocations) * 100) | round(2), change: (((.count / .total_invocations) - (.previous_count / .previous_total_invocations)) * 100) | round(2) }",
          "selectorType": "gcp-functions",
          "type": "progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 0.25
          },
          "viewId": 6,
          "viewRecordId": 27877
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70494,
          "label": "Function Names",
          "selector": ".functions | keys",
          "selectorType": "gcp-functions",
          "type": "tags",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": [
              "image-processor",
              "payment-webhook",
              "order-fulfillment",
              "notification-sender",
              "data-sync",
              "analytics-reporter",
              "catalog-updater",
              "inventory-checker"
            ]
          },
          "viewId": 6,
          "viewRecordId": 27877
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        }
      ],
      "order": 2,
      "parentId": "cloud-group",
      "type": "gcp-service"
    },
    {
      "component": "element_component",
      "icon": "/icons/airflow.svg",
      "id": 27878,
      "integrationId": 16,
      "key": "airflow-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70392,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "Airflow (Composer)"
          },
          "viewId": 6,
          "viewRecordId": 27878
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70393,
          "label": "DAG Status",
          "selector": ".dags | { running: .running, success: .success, failed: .failed }",
          "selectorType": "airflow",
          "type": "status",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": {
              "running": 2,
              "success": 15,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27878
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70472,
          "label": "Total DAGs",
          "selector": ".metrics.dags | { value: .total_count, change: ((.total_count - .previous_total_count) / .previous_total_count * 100) | round(1) }",
          "selectorType": "airflow",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "28"
          },
          "viewId": 6,
          "viewRecordId": 27878
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70474,
          "label": "CPU Usage",
          "selector": ".metrics.resources | { value: (.cpu_used_percent), change: ((.cpu_used_percent - .previous_cpu_used_percent)) | round(1) }",
          "selectorType": "airflow",
          "type": "progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 38.2
          },
          "viewId": 6,
          "viewRecordId": 27878
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70473,
          "label": "Memory Usage",
          "selector": ".metrics.resources | { value: (.memory_used_mb / .memory_allocated_mb * 100) | round(1), change: (((.memory_used_mb / .memory_allocated_mb) - (.previous_memory_used_mb / .previous_memory_allocated_mb)) * 100) | round(1) }",
          "selectorType": "airflow",
          "type": "progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 52.7
          },
          "viewId": 6,
          "viewRecordId": 27878
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70482,
          "label": "Active DAGs",
          "selector": ".dags.active | keys",
          "selectorType": "airflow",
          "type": "tags",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": [
              "daily_etl_pipeline",
              "sales_report_generator",
              "catalog_refresh",
              "order_processing",
              "data_synchronization",
              "fraud_detection",
              "customer_segmentation",
              "inventory_forecast",
              "marketing_analytics",
              "email_campaign_scheduler",
              "product_recommendations",
              "database_maintenance",
              "log_aggregation",
              "system_health_check",
              "user_behavior_analysis",
              "pricing_optimization",
              "warehouse_sync"
            ]
          },
          "viewId": 6,
          "viewRecordId": 27878
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        }
      ],
      "order": 3,
      "parentId": "cloud-group",
      "type": "gcp-service"
    },
    {
      "component": "element_component",
      "icon": "/icons/pubsub.svg",
      "id": 27879,
      "integrationId": 16,
      "key": "pub-sub-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70394,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "PubSub"
          },
          "viewId": 6,
          "viewRecordId": 27879
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70477,
          "label": "Success Rate",
          "selector": ".metrics.processing | { value: ((.successful / .total) * 100) | round(1), change: (((.successful / .total) - (.previous_successful / .previous_total)) * 100) | round(1) }",
          "selectorType": "pubsub",
          "type": "inversed_progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 99.8
          },
          "viewId": 6,
          "viewRecordId": 27879
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70395,
          "label": "Messages",
          "selector": ".metrics | { value: .message_count, change: ((.message_rate - .previous_message_rate) / .previous_message_rate * 100) | round(1) }",
          "selectorType": "pubsub",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "5,280 messages"
          },
          "viewId": 6,
          "viewRecordId": 27879
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70475,
          "label": "Topics",
          "selector": ".metrics.topics | { value: .count, change: ((.count - .previous_count) / .previous_count * 100) | round(1) }",
          "selectorType": "pubsub",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "12"
          },
          "viewId": 6,
          "viewRecordId": 27879
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70481,
          "label": "Topic Names",
          "selector": ".topics | keys",
          "selectorType": "pubsub",
          "type": "tags",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": [
              "order-events",
              "shipping-notifications",
              "inventory-updates",
              "payment-events",
              "user-activity",
              "system-alerts",
              "etl-triggers",
              "recommendation-events",
              "catalog-updates",
              "analytics-events",
              "email-triggers",
              "audit-logs"
            ]
          },
          "viewId": 6,
          "viewRecordId": 27879
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        }
      ],
      "order": 4,
      "parentId": "cloud-group",
      "type": "gcp-service"
    },
    {
      "component": "element_component",
      "icon": "/icons/stripe.svg",
      "id": 27880,
      "integrationId": 17,
      "key": "payments-service-stripe",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70396,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "Stripe"
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70397,
          "label": "API Requests (per minute)",
          "selector": ".metrics | { value: .api_requests, change: ((.api_request_rate - .previous_api_request_rate) / .previous_api_request_rate * 100) | round(1) }",
          "selectorType": "stripe",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "425"
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70458,
          "label": "Rate Limit",
          "selectorType": "stripe",
          "type": "progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 50
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70458,
          "label": "Transaction Success Rate",
          "selector": ".metrics.transactions | { value: ((.successful / .total) * 100) | round(2), change: (((.successful / .total) - (.previous_successful / .previous_total)) * 100) | round(2) }",
          "selectorType": "stripe",
          "type": "inversed_progress",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": 99.2
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "type": "links",
          "value": {
            "data": [
              {
                "icon": "/icons/statuspage.svg",
                "label": "Status Page",
                "url": "https://status.stripe.com/"
              }
            ]
          }
        }
      ],
      "order": 5,
      "parentId": "egress-group",
      "type": "egress-domain"
    },
    {
      "component": "element_component",
      "icon": "/icons/datadog.svg",
      "id": 27881,
      "integrationId": 17,
      "key": "datadog-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70398,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "Datadog"
          },
          "viewId": 6,
          "viewRecordId": 27881
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70462,
          "label": "Log Processing Volume",
          "selector": ".metrics.logs | { value: .volume_gb, change: ((.volume_gb - .previous_volume_gb) / .previous_volume_gb * 100) | round(1) }",
          "selectorType": "datadog",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "35.2 GB"
          },
          "viewId": 6,
          "viewRecordId": 27881
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70463,
          "label": "APM Traces",
          "selector": ".metrics.apm | { value: .traces_count, change: ((.traces_rate - .previous_traces_rate) / .previous_traces_rate * 100) | round(1) }",
          "selectorType": "datadog",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "2.8M traces"
          },
          "viewId": 6,
          "viewRecordId": 27881
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "type": "links",
          "value": {
            "data": [
              {
                "icon": "/icons/statuspage.svg",
                "label": "Status Page",
                "url": "https://status.datadoghq.com/"
              }
            ]
          }
        }
      ],
      "order": 6,
      "parentId": "egress-group",
      "type": "egress-domain"
    },
    {
      "component": "element_component",
      "icon": "/icons/openai.svg",
      "id": 27882,
      "integrationId": 17,
      "key": "openai-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70400,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "OpenAI"
          },
          "viewId": 6,
          "viewRecordId": 27882
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70401,
          "label": "Billed Tokens",
          "selector": ".metrics.tokens | { value: .total, change: ((.rate - .previous_rate) / .previous_rate * 100) | round(1) }",
          "selectorType": "openai",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "1,257,683"
          },
          "viewId": 6,
          "viewRecordId": 27882
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70402,
          "label": "Billed Amount",
          "selector": ".metrics.billing | { value: .amount, change: ((.rate - .previous_rate) / .previous_rate * 100) | round(1) }",
          "selectorType": "openai",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "$125.75"
          },
          "viewId": 6,
          "viewRecordId": 27882
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70452,
          "label": "Average Latency",
          "selector": ".metrics.performance | { value: .avg_latency_ms, change: ((.avg_latency_ms - .previous_avg_latency_ms) / .previous_avg_latency_ms * 100) | round(1) }",
          "selectorType": "openai",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "850ms"
          },
          "viewId": 6,
          "viewRecordId": 27882
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70464,
          "label": "Token Usage by Model",
          "selector": ".metrics.model_usage | { gpt4: .gpt4_percent, gpt3_5: .gpt3_5_percent, other: .other_percent }",
          "selectorType": "openai",
          "type": "breakdown",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": {
              "gpt4": 68,
              "gpt3_5": 27,
              "other": 5
            }
          },
          "viewId": 6,
          "viewRecordId": 27882
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70465,
          "label": "Request Types",
          "selector": ".metrics.request_types | { chat: .chat_percent, completion: .completion_percent, embedding: .embedding_percent, other: .other_percent }",
          "selectorType": "openai",
          "type": "breakdown",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": {
              "chat": 72,
              "completion": 15,
              "embedding": 10,
              "other": 3
            }
          },
          "viewId": 6,
          "viewRecordId": 27882
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "type": "links",
          "value": {
            "data": [
              {
                "icon": "/icons/statuspage.svg",
                "label": "Status Page",
                "url": "https://status.openai.com/"
              }
            ]
          }
        }
      ],
      "order": 7,
      "parentId": "egress-group",
      "type": "egress-domain"
    },
    {
      "component": "element_component",
      "icon": "/icons/s3.svg",
      "id": 27883,
      "integrationId": 18,
      "key": "s3-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70403,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "S3 Storage"
          },
          "viewId": 6,
          "viewRecordId": 27883
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70404,
          "label": "Volume",
          "selector": ".metrics.storage | { value: .size_gb, change: ((.size_gb - .previous_size_gb) / .previous_size_gb * 100) | round(1) }",
          "selectorType": "s3",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "456.2 GB"
          },
          "viewId": 6,
          "viewRecordId": 27883
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70478,
          "label": "Buckets",
          "selector": ".metrics.buckets | { value: .count, change: ((.count - .previous_count) / .previous_count * 100) | round(1) }",
          "selectorType": "s3",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "8"
          },
          "viewId": 6,
          "viewRecordId": 27883
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70479,
          "label": "Objects",
          "selector": ".metrics.objects | { value: .count, change: ((.count - .previous_count) / .previous_count * 100) | round(1) }",
          "selectorType": "s3",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "1,245,682"
          },
          "viewId": 6,
          "viewRecordId": 27883
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70480,
          "label": "Transfer Rate",
          "selector": ".metrics.transfer | { value: .rate_mb_per_sec, change: ((.rate_mb_per_sec - .previous_rate_mb_per_sec) / .previous_rate_mb_per_sec * 100) | round(1) }",
          "selectorType": "s3",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "3.8 MB/s"
          },
          "viewId": 6,
          "viewRecordId": 27883
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        }
      ],
      "order": 8,
      "parentId": "cloud-group",
      "type": "s3-service"
    },
    {
      "component": "element_component",
      "icon": "/icons/shopify.svg",
      "id": 27884,
      "integrationId": 19,
      "key": "shopify-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70405,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "Shopify"
          },
          "viewId": 6,
          "viewRecordId": 27884
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70406,
          "label": "Orders",
          "selector": ".metrics.orders | { value: .count, change: ((.rate - .previous_rate) / .previous_rate * 100) | round(1) }",
          "selectorType": "shopify",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "138 orders"
          },
          "viewId": 6,
          "viewRecordId": 27884
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70407,
          "label": "API Requests (per minute)",
          "selector": ".metrics.api | { value: .request_count, change: ((.rate - .previous_rate) / .previous_rate * 100) | round(1) }",
          "selectorType": "shopify",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "1,250 requests"
          },
          "viewId": 6,
          "viewRecordId": 27884
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "type": "links",
          "value": {
            "data": [
              {
                "icon": "/icons/statuspage.svg",
                "label": "Status Page",
                "url": "https://status.shopify.com/"
              }
            ]
          }
        }
      ],
      "order": 9,
      "parentId": "egress-group",
      "type": "shopify-service"
    },
    {
      "component": "element_component",
      "icon": "/icons/salesforce.svg",
      "id": 27885,
      "integrationId": 20,
      "key": "salesforce-service",
      "layout": [
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70408,
          "label": "",
          "selector": ".value.metadata.name",
          "selectorType": "record",
          "type": "title",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "Salesforce"
          },
          "viewId": 6,
          "viewRecordId": 27885
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70410,
          "label": "Records",
          "selector": ".metrics.records | { value: .count, change: ((.count - .previous_count) / .previous_count * 100) | round(1) }",
          "selectorType": "salesforce",
          "type": "text",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": "12,850 records"
          },
          "viewId": 6,
          "viewRecordId": 27885
        },
        {
          "createdAt": "2025-03-19T01:00:00.000000Z",
          "id": 70456,
          "label": "Sync Status",
          "selector": ".metrics.sync | { success: .success_count, pending: .pending_count, failed: .failed_count }",
          "selectorType": "salesforce",
          "type": "status",
          "updatedAt": "2025-03-19T01:00:00.000000Z",
          "value": {
            "data": {
              "success": 124,
              "pending": 3,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27885
        },
        {
          "type": "status",
          "value": {
            "data": {
              "success": 1,
              "pending": 0,
              "failed": 0
            }
          },
          "viewId": 6,
          "viewRecordId": 27880
        },
        {
          "type": "links",
          "value": {
            "data": [
              {
                "icon": "/icons/statuspage.svg",
                "label": "Status Page",
                "url": "https://status.salesforce.com/"
              }
            ]
          }
        }
      ],
      "order": 10,
      "parentId": "egress-group",
      "type": "salesforce-service"
    },
    {
      "key": "payments-service-stripe-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-payment"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "payments-service-stripe"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/api/v1/payments",
                "method": "POST",
                "count": 8
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/api/v1/invoice/create",
                "method": "POST",
                "count": 17
              }
            ]
          }
        }
      ]
    },
    {
      "key": "checkout-service-stripe-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-checkout"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "payments-service-stripe"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/api/v1/payment-methods",
                "method": "POST",
                "count": 12
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/api/v1/charges",
                "method": "POST",
                "count": 23
              }
            ]
          }
        }
      ]
    },
    {
      "key": "ad-service-stripe-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-ad"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "shopify-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/admin/api/products",
                "method": "GET",
                "count": 15
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/admin/api/orders",
                "method": "GET",
                "count": 8
              }
            ]
          }
        }
      ]
    },
    {
      "key": "quote-service-salesforce-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-quote"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "salesforce-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/services/data/v58.0/sobjects/Quote",
                "method": "POST",
                "count": 7
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/services/data/v58.0/sobjects/Opportunity",
                "method": "GET",
                "count": 12
              }
            ]
          }
        }
      ]
    },
    {
      "key": "recommendation-service-openai-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-recommendation"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "openai-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/v1/chat/completions",
                "method": "POST",
                "count": 24
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/v1/embeddings",
                "method": "POST",
                "count": 15
              }
            ]
          }
        }
      ]
    },
    {
      "key": "otel-service-datadog-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-otel-demo-otel-collector"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "datadog-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/api/v2/logs",
                "method": "POST",
                "count": 35
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/api/v1/series",
                "method": "POST",
                "count": 28
              }
            ]
          }
        }
      ]
    },
    {
      "key": "frontend-service-cloudflare-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "to",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-frontend-proxy"
          }
        },
        {
          "type": "from",
          "value": {
            "data": "cloudflare-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/app",
                "method": "GET",
                "count": 5
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/faq",
                "method": "GET",
                "count": 3
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/pricing",
                "method": "GET",
                "count": 2
              }
            ]
          }
        }
      ]
    },
    {
      "key": "image-service-s3-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-image-provider"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "s3-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "airflow-service-postgres-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "airflow-service"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "postgres-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "airflow-service-cloud-func-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "airflow-service"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "cloud-func-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        },
        {
          "type": "endpoints",
          "value": {
            "data": [
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/function/image-processor",
                "method": "POST",
                "count": 8
              },
              {
                "endpointType": "HTTP",
                "avgLatencyMs": 470,
                "rps": 100,
                "errorRate": 0.02,
                "endpoint": "/function/data-sync",
                "method": "POST",
                "count": 12
              }
            ]
          }
        }
      ]
    },
    {
      "key": "airflow-service-pub-sub-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "airflow-service"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "pub-sub-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "shipping-service-pub-sub-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-shipping"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "pub-sub-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "shipping-service-postgres-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-shipping"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "postgres-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "payments-service-postgres-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-payment"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "postgres-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "email-service-postgres-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-email"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "postgres-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "checkout-service-postgres-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-checkout"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "postgres-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "product-catalog-service-postgres-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-product-catalog"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "postgres-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    },
    {
      "key": "cart-service-postgres-network-flow",
      "type": "network-flow",
      "component": "connection",
      "order": 0,
      "integrationId": 14,
      "layout": [
        {
          "type": "from",
          "value": {
            "data": "org_01JKSGS6VGNT5GDMTADP4ZPPBB-14-k8s-service-default-email"
          }
        },
        {
          "type": "to",
          "value": {
            "data": "postgres-service"
          }
        },
        {
          "type": "errorRate",
          "value": {
            "data": 0.02
          }
        },
        {
          "type": "latency",
          "value": {
            "data": 470
          }
        },
        {
          "type": "rps",
          "value": {
            "data": 100
          }
        }
      ]
    }
  ]
  