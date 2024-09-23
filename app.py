# app.py

from flask import Flask, request, jsonify

app = Flask(__name__)

# Simulate a memory and CPU registers 
memory = {10:5, 20:3, 30:0}

cpu_registers ={
    "PC": 0, # Program Counter
    "IR": "", # Instruction Register
    "MAR": 0, # Memory Address Register
    "MDR": 0, # Memory Data Register
    "ACC": 0, # Accumulator
}

instructions = ["LOAD 10", "ADD 20", "STORE 30"]

@app.route('/cpu', methods=['GET'])
def run_cycle():
    if cpu_registers["PC"] >= len(instructions):
        return jsonify({"message": "Program completed"}), 200
    
    # Fetch instruction
    