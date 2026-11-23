"""Mal Final voice v4 = 'Qwen 1 Cálido Narrador' (user pick 22-Nov). Clones the synthetic reference tts/ref_narrador.wav
(made with Qwen3-TTS VoiceDesign, not a real person) with Qwen3-TTS-1.7B-Base. Usage: qwen_voice.py script.txt out.wav"""
import sys, os, glob, torch, soundfile as sf
from qwen_tts import Qwen3TTSModel
torch.set_num_threads(2); torch.manual_seed(int(os.environ.get('SEED', 1)))
D = os.path.dirname(os.path.abspath(__file__))
REF_TEXT = ("Le prometió a la policía usar un muñeco… ¡y saltó él mismo de la Torre Eiffel! París, mil novecientos doce. Franz Reichelt, sastre, "
            "está obsesionado con volar. Cuatro de febrero, ocho de la mañana. Hace frío… y hay viento. Pone un pie en la baranda… y se queda ahí. Cuarenta segundos. Y salta.")
P = glob.glob('/root/.cache/huggingface/hub/models--Qwen--Qwen3-TTS-12Hz-1.7B-Base/snapshots/*')
m = Qwen3TTSModel.from_pretrained(P[0] if P else "Qwen/Qwen3-TTS-12Hz-1.7B-Base", device_map="cpu", dtype=torch.bfloat16)
text = ' '.join(l.strip() for l in open(sys.argv[1], encoding='utf-8') if l.strip())
w, sr = m.generate_voice_clone(text=text, language="Spanish", ref_audio=f'{D}/ref_narrador.wav', ref_text=REF_TEXT)
sf.write(sys.argv[2], w[0], sr); print('done', len(w[0]) / sr)
