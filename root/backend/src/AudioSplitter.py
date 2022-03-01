from pydub import AudioSegment

timeStamps = [
    [
        0,   # Start of page 1
        47,  # end of page 1 and start of page 2
        110,   # Start of page 2 (repeat these 3 steps)
        168,
        208,  # Also note: you should add 2 extra seconds onto the duration
        245
    ]
]

for ch in range(1, 2, 1):
    chapterAudio = AudioSegment.from_wav(
        f"../Audio/Chapter-{ch}-Audio/Chapter {ch}.wav")

    for i in range(len(timeStamps[ch-1])-1):
        start = timeStamps[ch-1][i] * 1000  # Works in milliseconds
        end = timeStamps[ch-1][i+1] * 1000

        newAudio = chapterAudio[start:end]
        # Exports to a wav file in the current path.
        newAudio.export(
            f"../Audio/Chapter-{ch}-Audio/Chapter-1-Cut-{i}.wav", format="wav")
