# proyecto_ia

Proyecto base para desarrollar un sistema de Inteligencia Artificial.

## Estructura

```text
proyecto_ia/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
├── src/
├── models/
├── requirements.txt
├── environment.yml
├── .gitignore
└── README.md
```

## Descripción de carpetas

- `data/raw/`: datos originales, sin modificar.
- `data/processed/`: datos preparados para el análisis o entrenamiento.
- `notebooks/`: notebooks de Jupyter para pruebas y experimentación.
- `src/`: código fuente del proyecto.
- `models/`: modelos entrenados y archivos relacionados.

## Instalación con Conda

```bash
conda env create -f environment.yml
conda activate entorno_ia
```

## Instalación con pip

```bash
pip install -r requirements.txt
```

## Inicio

Coloca los datos originales en `data/raw/` y desarrolla el procesamiento y los modelos dentro de `src/`.
