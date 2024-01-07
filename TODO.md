# Visualizer

### Proper fucking rewrite

- Stop using values like pixels or overall random fucking numbers between 0-255 or 254
- Convert all to 0.00 - 1.00, more consistency and readability
- Surely we don't need this many global variables for 1 fucking feature

### What we know (that might be important)

- We get half the size of the FFT as audio data
    - 4096 samples = 2048 audio data snippets
    - This means 44100Hz of data is divided into 2048 pieces of numbers
    - In this case, 1 data would equal to ~21.5Hz of data