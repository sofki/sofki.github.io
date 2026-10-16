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

The most difficult part of this tutorial is to install all needed packages at your Linux machine and get them work together! Start by installing Maize, REINVENT4 and Autodock-GPU, following the instructions at their corersponding github pages, provided as links above. I am providing here a .yml for my working reinvent4 conda environment to **use as a reference**, but please have in mind that the aforementioned packages should be installed according to their instructions, you want be able to do it automatically using my .yml file (or if you can, email me how!!). The file can be found [here](https://github.com/sofki/sofki.github.io/blob/master/assets/files/reinvent4.yml).

REINVENT4 uses agents (a.k.a. pretained Neural Network models) in order to predict the next character in a SMILES string and construct a new molecule. It uses Autoregressive Generation to do so, i.e., it builds the molecule one letter (token) at a time, based on the probability of what would make chemical sense. The agents are already trained on large ChEMBL databases of bioactive molecules, so that they can "recognise" what a drug molecule looks like. The use of pretrained models is very useful for small drug discovery projects when there is lack of sufficient data. For example, in this project, only 13 known inhibitors were already known for this receptor.Thirteen data points are too little for an ML model to work.

The image below ([source](https://link.springer.com/article/10.1186/s13321-024-00812-5?utm_source=rct_congratemailt&utm_medium=email&utm_campaign=oa_20240221&utm_content=10.1186%2Fs13321-024-00812-5)) shows the different funcionalities of REINVENT4. It uses TOML or JSON files as inputs, along with SMILES files when necessary. It offers different Generator Models, working with combined Reinforcement/Curriculum staged Learning or Transfer Learning and uses Sampling to generate molecules based on the results of the model produced by either mode of Learning, while it finally uses Scoring too score the generated molecules based on user-defined criteria.

![reinventdiagram](https://github.com/sofki/sofki.github.io/blob/master/assets/img/REINVENT.png)

In **Reinforcement / Curriculum (Staged) Learning** a pretrained generative model is fine-tuned by sampling candidate molecules, scoring them against the design criteria, and updating the model so that high-scoring structures become more likely — a reward-driven search rather than imitation of a fixed dataset. Because a multi-component objective (similarity to the seed molecule, physicochemical filters, docking) is hard to satisfy all at once, the reward is introduced in stages: the model first learns the easy, cheap criteria, and each stage’s model initialises the next, with harder and more expensive terms switched on progressively until the full objective is active.

In **Transfer Learning** a model trained on a large, general corpus — here a ChEMBL-wide set of bioactive molecules — is reused as the starting point for a narrower task instead of being trained from scratch. The general model supplies the broadly useful knowledge (valid SMILES syntax, drug-like chemistry, common scaffolds and functional groups), and fine-tuning on a small focused set, such as known inhibitors of the target or analogues of the seed molecule, biases generation toward that chemical space. This makes the narrow task learnable from a few hundred or few thousand examples, far fewer than training from zero would require.

In this project, due to the very limited data (only 13 known inhibitors) we used the first approach.



Assuming you have a working conda environment with Maize, REINVENT and Autodock-GPU, you should start by moving these configuration files at your working directory:



