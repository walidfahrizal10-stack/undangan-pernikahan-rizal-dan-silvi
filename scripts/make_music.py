"""Synthesises a soft instrumental placeholder (public/music/musik-undangan.mp3).
Replace that file with your own song (keep the same file name)."""
import numpy as np, lameenc
SR = 44100
BPM = 66
beat = 60 / BPM
def midi(n): return 440 * 2 ** ((n - 69) / 12)
def pluck(f, dur, vel=0.3):
    t = np.arange(int(SR * dur)) / SR
    s = sum(a * np.sin(2 * np.pi * f * k * t) * np.exp(-t * d) for k, a, d in [(1, 1, 1.6), (2, .35, 2.6), (3, .15, 3.6), (4, .06, 4.5)])
    att = np.minimum(t / 0.006, 1)
    return vel * s * att
def pad(f, dur, vel=0.05):
    t = np.arange(int(SR * dur)) / SR
    env = np.minimum(t / 1.2, 1) * np.minimum((dur - t) / 1.2, 1)
    return vel * env * (np.sin(2*np.pi*f*t) + .5*np.sin(2*np.pi*f*1.003*t) + .25*np.sin(2*np.pi*f*2*t))
prog = [(48,[0,4,7]),(43,[0,4,7]),(45,[0,3,7]),(40,[0,3,7]),(41,[0,4,7]),(48,[0,4,7]),(41,[0,4,7]),(43,[0,4,7,10])]
mel_a = [76,79,77,76, 74,76,72,74, 72,76,74,72, 71,74,72,71, 69,72,71,69, 67,72,76,79, 77,76,74,72, 74,71,74,67]
total = len(prog) * 4 * 2 * beat + 4
out = np.zeros(int(SR * total))
pos = 0.0
for rep in range(2):
    for ci, (root, ch) in enumerate(prog):
        t0 = pos
        notes = [root] + [root + 12 + c for c in ch] + [root + 24 + ch[1]]
        for i in range(8):                       # 8 eighth-note arpeggio steps
            n = [root + 12 + ch[0], root + 12 + ch[1], root + 12 + ch[2], root + 24 + ch[0]][[0,1,2,3,2,1,2,1][i]]
            s = pluck(midi(n), 2.2, .16); k = int(SR * (t0 + i * beat / 2)); out[k:k+len(s)] += s[:len(out)-k]
        s = pluck(midi(root), 3.8, .24); k = int(SR*t0); out[k:k+len(s)] += s[:len(out)-k]
        p = pad(midi(root + 12), 4 * beat + 1.4); out[k:k+len(p)] += p[:len(out)-k]
        if rep == 1:                             # melody on 2nd pass
            for j in range(4):
                m = mel_a[(ci * 4 + j) % len(mel_a)]
                s = pluck(midi(m), 2.6, .2); kk = int(SR * (t0 + j * beat)); out[kk:kk+len(s)] += s[:len(out)-kk]
        pos += 4 * beat
# soft reverb (feedback combs)
wet = np.zeros_like(out)
for d, g in [(0.037, .45), (0.053, .38), (0.071, .3), (0.097, .24)]:
    n = int(SR * d); buf = out.copy()
    for i in range(n, len(buf)): buf[i] += g * buf[i - n]
    wet += buf
out = out * .55 + wet * .18
fade = int(SR * 3); out[-fade:] *= np.linspace(1, 0, fade); out[:int(SR*.05)] *= np.linspace(0, 1, int(SR*.05))
out = out / np.max(np.abs(out)) * 0.8
pcm = (out * 32767).astype(np.int16)
enc = lameenc.Encoder(); enc.set_bit_rate(80); enc.set_in_sample_rate(SR); enc.set_channels(1); enc.set_quality(2)
open('public/music/musik-undangan.mp3', 'wb').write(enc.encode(pcm.tobytes()) + enc.flush())
print('seconds', round(total))
