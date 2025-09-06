#!/usr/bin/env python3
"""
Balance Agent - Smart Launcher
==============================

This script provides an intelligent launcher for the Balance Agent app,
automatically handling dependencies, environment setup, and server coordination.

Usage:
    python launch.py [options]

Options:
    --install    Install all dependencies first
    --dev        Run in development mode (default)
    --build      Build the application
    --help       Show this help message
"""

import os
import sys
import subprocess
import time
import webbrowser
import signal
import threading
from pathlib import Path
from typing import List, Optional

class Colors:
    """ANSI color codes for terminal output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class BalanceAgentLauncher:
    def __init__(self):
        self.root_dir = Path(__file__).parent
        self.server_dir = self.root_dir / "apps" / "server"
        self.client_dir = self.root_dir / "apps" / "client"
        self.processes: List[subprocess.Popen] = []
        self.running = False

    def print_header(self):
        """Print the application header"""
        print(f"{Colors.HEADER}{Colors.BOLD}")
        print("╔══════════════════════════════════════════════════════════════╗")
        print("║                    Balance Agent Launcher                    ║")
        print("║              Avatar-First Life Balance Companion             ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print(f"{Colors.ENDC}")

    def print_status(self, message: str, status: str = "INFO"):
        """Print a status message with color coding"""
        color = Colors.OKGREEN if status == "SUCCESS" else \
                Colors.WARNING if status == "WARNING" else \
                Colors.FAIL if status == "ERROR" else \
                Colors.OKCYAN
        print(f"{color}[{status}]{Colors.ENDC} {message}")

    def check_requirements(self) -> bool:
        """Check if required tools are installed"""
        self.print_status("Checking system requirements...")
        
        # Check Node.js
        try:
            result = subprocess.run(["node", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                self.print_status(f"Node.js: {result.stdout.strip()}", "SUCCESS")
            else:
                self.print_status("Node.js not found. Please install Node.js 18+", "ERROR")
                return False
        except FileNotFoundError:
            self.print_status("Node.js not found. Please install Node.js 18+", "ERROR")
            return False

        # Check npm
        try:
            result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
            if result.returncode == 0:
                self.print_status(f"npm: {result.stdout.strip()}", "SUCCESS")
            else:
                self.print_status("npm not found", "ERROR")
                return False
        except FileNotFoundError:
            self.print_status("npm not found", "ERROR")
            return False

        return True

    def install_dependencies(self):
        """Install all project dependencies"""
        self.print_status("Installing dependencies...")
        
        # Install root dependencies
        self.print_status("Installing root dependencies...")
        result = subprocess.run(["npm", "install"], cwd=self.root_dir)
        if result.returncode != 0:
            self.print_status("Failed to install root dependencies", "ERROR")
            return False

        # Install server dependencies
        self.print_status("Installing server dependencies...")
        result = subprocess.run(["npm", "install"], cwd=self.server_dir)
        if result.returncode != 0:
            self.print_status("Failed to install server dependencies", "ERROR")
            return False

        # Install client dependencies
        self.print_status("Installing client dependencies...")
        result = subprocess.run(["npm", "install"], cwd=self.client_dir)
        if result.returncode != 0:
            self.print_status("Failed to install client dependencies", "ERROR")
            return False

        self.print_status("All dependencies installed successfully!", "SUCCESS")
        return True

    def setup_environment(self):
        """Set up environment variables"""
        self.print_status("Setting up environment...")
        
        env_file = self.root_dir / ".env"
        if not env_file.exists():
            self.print_status("Creating .env file...")
            env_content = """# Balance Agent Environment Variables
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
PORT=5050
NODE_ENV=development
"""
            env_file.write_text(env_content)
            self.print_status("Created .env file. Please add your OpenAI API key.", "WARNING")
        else:
            self.print_status(".env file already exists", "SUCCESS")

    def start_server(self) -> Optional[subprocess.Popen]:
        """Start the backend server"""
        self.print_status("Starting backend server...")
        
        try:
            process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=self.server_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            # Wait a moment to see if server starts successfully
            time.sleep(2)
            if process.poll() is None:
                self.print_status("Backend server started on http://localhost:5050", "SUCCESS")
                return process
            else:
                self.print_status("Failed to start backend server", "ERROR")
                return None
        except Exception as e:
            self.print_status(f"Error starting server: {e}", "ERROR")
            return None

    def start_client(self) -> Optional[subprocess.Popen]:
        """Start the frontend client"""
        self.print_status("Starting frontend client...")
        
        try:
            process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=self.client_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                universal_newlines=True
            )
            
            # Wait a moment to see if client starts successfully
            time.sleep(3)
            if process.poll() is None:
                self.print_status("Frontend client started on http://localhost:5173", "SUCCESS")
                return process
            else:
                self.print_status("Failed to start frontend client", "ERROR")
                return None
        except Exception as e:
            self.print_status(f"Error starting client: {e}", "ERROR")
            return None

    def monitor_processes(self):
        """Monitor running processes and handle output"""
        def read_output(process, name):
            try:
                for line in iter(process.stdout.readline, ''):
                    if line:
                        print(f"{Colors.OKBLUE}[{name}]{Colors.ENDC} {line.strip()}")
            except:
                pass

        # Start monitoring threads for each process
        for i, process in enumerate(self.processes):
            name = "SERVER" if i == 0 else "CLIENT"
            thread = threading.Thread(target=read_output, args=(process, name))
            thread.daemon = True
            thread.start()

    def open_browser(self):
        """Open the application in the browser"""
        self.print_status("Opening application in browser...")
        time.sleep(2)  # Give servers time to fully start
        webbrowser.open("http://localhost:5173")

    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        self.print_status("Shutting down...", "WARNING")
        self.running = False
        self.cleanup()
        sys.exit(0)

    def cleanup(self):
        """Clean up running processes"""
        for process in self.processes:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
        self.processes.clear()

    def run_development(self):
        """Run the application in development mode"""
        self.print_status("Starting Balance Agent in development mode...")
        
        # Start server
        server_process = self.start_server()
        if not server_process:
            return False
        
        # Start client
        client_process = self.start_client()
        if not client_process:
            server_process.terminate()
            return False
        
        self.processes = [server_process, client_process]
        self.running = True
        
        # Set up signal handlers
        signal.signal(signal.SIGINT, self.signal_handler)
        signal.signal(signal.SIGTERM, self.signal_handler)
        
        # Monitor processes
        self.monitor_processes()
        
        # Open browser
        self.open_browser()
        
        # Print status
        print(f"\n{Colors.OKGREEN}{Colors.BOLD}🚀 Balance Agent is running!{Colors.ENDC}")
        print(f"{Colors.OKCYAN}📱 Frontend: http://localhost:5173{Colors.ENDC}")
        print(f"{Colors.OKCYAN}🔧 Backend:  http://localhost:5050{Colors.ENDC}")
        print(f"\n{Colors.WARNING}Press Ctrl+C to stop{Colors.ENDC}\n")
        
        # Keep running
        try:
            while self.running:
                time.sleep(1)
                # Check if processes are still running
                for i, process in enumerate(self.processes):
                    if process.poll() is not None:
                        name = "Server" if i == 0 else "Client"
                        self.print_status(f"{name} process stopped unexpectedly", "ERROR")
                        self.running = False
                        break
        except KeyboardInterrupt:
            pass
        finally:
            self.cleanup()
        
        return True

    def build_application(self):
        """Build the application for production"""
        self.print_status("Building Balance Agent...")
        
        # Build server
        self.print_status("Building server...")
        result = subprocess.run(["npm", "run", "build"], cwd=self.server_dir)
        if result.returncode != 0:
            self.print_status("Failed to build server", "ERROR")
            return False
        
        # Build client
        self.print_status("Building client...")
        result = subprocess.run(["npm", "run", "build"], cwd=self.client_dir)
        if result.returncode != 0:
            self.print_status("Failed to build client", "ERROR")
            return False
        
        self.print_status("Build completed successfully!", "SUCCESS")
        return True

def main():
    """Main entry point"""
    launcher = BalanceAgentLauncher()
    launcher.print_header()
    
    # Parse command line arguments
    args = sys.argv[1:]
    
    if "--help" in args or "-h" in args:
        print(__doc__)
        return
    
    # Check requirements
    if not launcher.check_requirements():
        sys.exit(1)
    
    # Install dependencies if requested
    if "--install" in args:
        if not launcher.install_dependencies():
            sys.exit(1)
    
    # Set up environment
    launcher.setup_environment()
    
    # Build if requested
    if "--build" in args:
        if not launcher.build_application():
            sys.exit(1)
        return
    
    # Run in development mode (default)
    if not launcher.run_development():
        sys.exit(1)

if __name__ == "__main__":
    main()
