from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Initialize memory from address 8 to 102
initial_memory = {i: 0 for i in range(8, 103)}
initial_memory.update({10: 2, 11: 3, 100: "LOAD 10", 101: "ADD 11", 102: "STORE 12"})

initial_cpu_registers = {
    "PC": 100,  # Program Counter starts at 100
    "CIR": "",  # Current Instruction Register
    "MAR": 0,  # Memory Address Register
    "MDR": 0,  # Memory Data Register
    "AC": 0,  # Accumulator
    "CU": "",  # Control Unit
    "ALU": 0,  # Arithmetic Logic Unit
}

# Current memory and CPU registers
memory = initial_memory.copy()
cpu_registers = initial_cpu_registers.copy()

@app.route('/run-cycle', methods=['POST'])
def run_cycle():
    global memory, cpu_registers

    # Fetch step
    cpu_registers["MAR"] = cpu_registers["PC"]
    cpu_registers["MDR"] = memory[cpu_registers["MAR"]]
    cpu_registers["CIR"] = cpu_registers["MDR"]
    cpu_registers["CU"] = cpu_registers["CIR"]
    cpu_registers["PC"] += 1

    # Decode step
    operation, address = cpu_registers["CU"].split()
    address = int(address)
    cpu_registers["MAR"] = address
    cpu_registers["MDR"] = memory[cpu_registers["MAR"]]

    # Execute step
    if operation == "LOAD":
        cpu_registers["AC"] = cpu_registers["MDR"]
    elif operation == "ADD":
        cpu_registers["ALU"] = cpu_registers["AC"] + cpu_registers["MDR"]
        cpu_registers["AC"] = cpu_registers["ALU"]
    elif operation == "STORE":
        memory[cpu_registers["MAR"]] = cpu_registers["AC"]
    else:
        return jsonify({"error": "Invalid operation"}), 400

    return jsonify({"cpu_registers": cpu_registers, "memory": memory}), 200

if __name__ == '__main__':
    app.run(debug=True)