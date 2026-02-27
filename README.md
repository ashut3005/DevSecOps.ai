# DevSecOps & Cloud Assignment Submission

### Assignments:
- Linux Monitoring & Log Analysis
- Terraform AWS EC2 Automation
- Chrome Extension – Speaker-Separated Meeting Transcription

## Assignment 1: Linux Monitoring and Log Analysis
### Objective

Monitor system performance and analyze logs using Linux commands and automate the process using a Bash script.

### Tools Used
- Ubuntu (WSL)
- Linux CLI Commands
- Bash Scripting

## Commands Used
### CPU Usage
```bash
top
```
### Memory Usage
```bash
free -h
```
### Disk Usage
```bash
df -h
```

### Running Processes
```bash
ps aux | head
```

### System Logs
```bash
journalctl -n 10
```

### Monitoring Script (monitor.sh)
```bash
#!/bin/bash

echo "===== SYSTEM MONITORING REPORT ====="
echo "Date: $(date)"
echo ""

echo "---- CPU Usage ----"
top -bn1 | grep "Cpu(s)"

echo ""
echo "---- Memory Usage ----"
free -h

echo ""
echo "---- Disk Usage ----"
df -h

echo ""
echo "---- Top Processes ----"
ps -eo pid,cmd,%mem,%cpu --sort=-%cpu | head

echo ""
echo "---- Recent Logs ----"
journalctl -n 5

echo "====================================="
```
### Run script:
```bash
chmod +x monitor.sh
./monitor.sh
```
## Assignment 2: Automate Server Setup using Terraform (AWS EC2)
### Objective

Provision a Linux EC2 instance automatically using Terraform.

### Tools Used
- Terraform
- AWS EC2
- AWS IAM
- AWS CLI
- Ubuntu (WSL)

### Project Structure
```bash
terraform-ec2/
│
└── main.tf
```

### Terraform Configuration (main.tf)
```bash
provider "aws" {
  region = "ap-south-1"
}

resource "aws_security_group" "allow_ssh_http" {
  name = "allow_ssh_http"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "my_ec2" {
  ami           = "ami-0f5ee92e2d63afc18"
  instance_type = "t2.micro"
  security_groups = [aws_security_group.allow_ssh_http.name]

  tags = {
    Name = "Terraform-EC2"
  }
}
```
### Terraform Workflow

Initialize:
```bash
terraform init
```

Plan:
```bash
terraform plan
```

Apply:
```bash
terraform apply
```
Destroy:
```bash
terraform destroy
```


## Assignment 3: Chrome Extension – Speaker-Separated Meeting Transcription
### Objective

Develop a Chrome Extension that:
- Captures meeting tab audio
- Performs speaker-separated speech-to-text
- Displays live transcript
- Stores transcripts in MongoDB

### Tech Stack

Frontend:
- Chrome Extension (Manifest V3)
- JavaScript

Backend:
- Node.js
- Express
- WebSocket
- MongoDB
- AssemblyAI API (Speech-to-Text with Speaker Diarization)

### Project Structure
```bash
meeting-transcriber/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── extension/
    ├── manifest.json
    ├── background.js
    ├── popup.html
    └── popup.js
```
### Architecture

Chrome Extension
- Capture tab audio
- WebSocket → Node.js Backend
- AssemblyAI API (Speech + Speaker Diarization)
- MongoDB
- Live transcript in extension UI

### How to Run
Backend
```bash
cd backend
npm install
node server.js
```

### Load Extension
- Open Chrome
- Go to chrome://extensions
- Enable Developer Mode
- Click “Load Unpacked”
- Select extension folder

### Database Schema
```bash
{
  "speaker": "Speaker 1",
  "text": "Hello everyone",
  "time": "2026-02-28T10:00:00"
}
```

### Features Implemented
- Speaker diarization
- WebSocket streaming
- Clean modular structure
- Secure API key using .env
- Proper error handling
