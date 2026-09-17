# proyecto_ia

Estructura de proyecto basada en Cookiecutter Data Science.

## Estructura

- `data/raw/`: datos originales.
- `data/processed/`: datos procesados.
- `notebooks/`: cuadernos Jupyter.
- `src/`: código fuente.
- `models/`: modelos entrenados.
- `requirements.txt`: dependencias de Python.
- `environment.yml`: entorno Conda.
- `.gitignore`: archivos ignorados por Git.

## Instalación con Conda

```bash
conda env create -f environment.yml
conda activate entorno_ia
```

## Instalación con pip

```bash
pip install -r requirements.txt
```
