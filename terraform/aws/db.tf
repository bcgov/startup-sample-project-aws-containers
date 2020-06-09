resource "aws_docdb_subnet_group" "default" {
  name       = "sample-main"
  subnet_ids = aws_subnet.private.*.id

  tags = {
    Name = "sample docdb subnet group"
  }
}

resource "aws_docdb_cluster_instance" "cluster_instances" {
  count              = var.db_cluster_number_instances
  identifier         = "${var.db_cluster_name}-${count.index}"
  cluster_identifier = aws_docdb_cluster.docdb.id
  instance_class     = var.db_instance_type

  tags = local.common_tags
}

resource "aws_docdb_cluster" "docdb" {
  cluster_identifier      = "${var.db_cluster_name}-cluster"
  engine                  = "docdb"
  master_username         = var.db_masteruser_username
  master_password         = aws_secretsmanager_secret_version.db_user_password.secret_string
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot     = true
  db_subnet_group_name    = aws_docdb_subnet_group.default.name
  vpc_security_group_ids  = [aws_security_group.docdb.id]

  tags = local.common_tags
}

resource "aws_secretsmanager_secret" "sample-secrets-userpwd" {
  name                     = "Applications/sample/db_user_pwd" 
  recovery_window_in_days  = 0

  tags = local.common_tags
}

resource "aws_secretsmanager_secret_version" "db_user_password" {
  secret_id     = aws_secretsmanager_secret.sample-secrets-userpwd.id
  secret_string = random_password.dbpassword.result
}

resource "random_password" "dbpassword" {
  length  = 16
  special = false  
}
