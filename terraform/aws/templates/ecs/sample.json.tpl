[
  {
    "name": "${container_name}",
    "image": "${app_image}",
    "cpu": ${fargate_cpu},
    "memory": ${fargate_memory},
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": ${app_port},
        "hostPort": ${app_port}
      }
    ],
    "environment": [  
      {
        "name": "DB_NAME",
        "value": "${db_name}"
      },
      {
        "name": "AWS_REGION",
        "value": "${aws_region}"
      }
    ]
  }
]