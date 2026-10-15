---
layout: post
title: ML-derived p-cymene derivatives using REINVENT4
subtitle: An ML tutorial using the open-source REINVENT4 package with pretrained models 
cover-img: 
thumbnail-img: https://sofki.github.io//assets/img/reinvent4.png
share-img: https://sofki.github.io//assets/img/reinvent4.png
tags: [tutorials, ML, derivatives]
author: Sofia Kiriakidi
---

In this tutorial, we will see how to use the open-source ML package [REINVENT4](https://github.com/MolecularAI/REINVENT4), an AI molecular design tool for de novo design, scaffold hopping, R-group replacement, linker design and molecule optimization, developed by [MolecularAI- Astra Zeneca](https://www.astrazeneca.com/r-d/science-and-technologies/ilab.html), the original publication of which can be found [here](https://link.springer.com/article/10.1186/s13321-024-00812-5?utm_source=rct_congratemailt&utm_medium=email&utm_campaign=oa_20240221&utm_content=10.1186%2Fs13321-024-00812-5). We will combine it with [Maize](https://github.com/MolecularAI/maize), a graph-based workflow manager for computational chemistry pipelines, developed by the same group and [Autodock-GPU](https://github.com/ccsb-scripps/autodock-gpu), developed by the [Forli Lab](https://forlilab.org/) at [Scripps Research](https://www.scripps.edu/).

The most difficult part of this tutorial is to install all needed packages at your Linux machine and get them work together! Start by installing Maize, REINVENT4 and Autodock-GPU, following the instructions at their corersponding github pages, provided as links above.
