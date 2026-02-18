# 24 Game Solver

## Overview

This is an advanced web-based 24-point game calculator implemented with pure HTML, CSS, and JavaScript. After users input four numbers between 1-13, the program intelligently enumerates all possible arithmetic combinations to find expressions that evaluate to 24, while automatically removing all mathematically equivalent duplicate solutions.

## Key Features

### Complete Mathematical Deduplication
- Handles commutative law duplicates (e.g., 3+4+5 vs 5+4+3)
- Handles associative law duplicates (e.g., (1+2)+3 vs 1+(2+3))
- Handles mixed operation equivalents (e.g., 3+5-2 vs 3-2+5)
- Merges all bracket variation cases (e.g., ((3+(5-2)))*4 vs (3+5-2)*4)

### Intelligent Expression Simplification
- Automatically removes unnecessary parentheses
- Maintains natural mathematical expression forms
- Displays the most concise expression representation

### Performance Optimizations
- Efficient data structures
- Fast duplicate detection algorithm
- Computation time statistics display

## How to Use

1. **Input Numbers**: Enter four integers between 1-13 in the input boxes
2. **Calculate**: Click the "Calculate" button or press Enter
3. **View Results**:
   - All unique solutions will be clearly listed
   - "No solution found" will display if no valid combinations exist
   - Shows total solution count and computation time

## Technical Implementation

### Core Algorithm

1. **Permutation Generation**: Recursively generates all number permutations
2. **Operator Combination**: Tests all four basic arithmetic operations
3. **Parenthesis Combination**: Considers five operation priority groupings
4. **Normalization Process**:
   - Syntax tree parsing
   - Expression standardization
   - Equivalence detection

### Key Functions

- `solve24(numbers)`: Main calculation logic
- `makeCanonical(node)`: Core expression normalization
- `normalizeExpression(expr)`: Expression simplification
- `getCanonicalForm(expr)`: Generates unique identifiers

## File Structure

```
24-point-calculator-ultimate/
├── index.html          # Main HTML structure
├── (Embedded CSS)      # Responsive UI design
└── (Embedded JavaScript) # Core calculation and optimization logic
```

## Example Demonstration

**Input**:  
Numbers: 2, 3, 4, 5

**Output**:
```
2 * (3 + 4 + 5) = 24
4 * (3 + 5 - 2) = 24
2 solutions found in 21.2ms
```

## Advanced Features

1. **Smart Parenthesis Handling**:
   - Automatically determines parenthesis necessity
   - Maintains operation precedence

2. **Special Case Equivalence**:
   - Recognizes a-(b-c) ≡ (a-b)+c
   - Recognizes a/(b/c) ≡ (a×c)/b

3. **Performance Monitoring**:
   - Real-time computation statistics
   - Efficient memory management

## Extension Suggestions

1. Add difficulty levels (limit operator types)
2. Implement step-by-step solution demonstration
3. Add timed game mode
4. Include user history records

## License

This project is licensed under the MIT Open Source License. Feel free to use and modify.
