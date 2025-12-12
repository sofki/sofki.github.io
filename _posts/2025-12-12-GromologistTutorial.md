---
layout: post
title: Protein-Ligand system automated setup with Gromologist
subtitle: A GROMACS tutorial using the python package Gromologist 
cover-img: 
thumbnail-img: https://sofki.github.io//assets/img/gmx.png
share-img: https://sofki.github.io//assets/img/gmx.png
tags: [tutorials, GROMACS, MD, Gromologist]
author: Sofia Kiriakidi
---

In our previous [tutorial](https://sofki.github.io/2025-12-01-MDtutorial/), we saw step by step how one can externally parametrize a ligand and build a protein-ligand system topology for MD simulations with Gromacs. However, this method, although simple, can be quite tedious, especially if you have to parametrize a large number of systems with different ligands. Luckily, a python package called [Gromologist](https://gitlab.com/KomBioMol/gromologist) can automize a lot of the process and make it less prone to human error. The package has a lot of utilities, that will not be covered in this tutorial. For its full capability, visit their [tutorials](https://gitlab.com/KomBioMol/gromologist/-/wikis/Tutorials) website!

First you need to setup a python environment where you will have [gromacs](https://anaconda.org/channels/conda-forge/packages/gromacs/overview) and [gromologist](https://gitlab.com/KomBioMol/gromologist#installation) installed. Then, you will need to parametrize your ligand with a external tool, depending on the forcefiled taht you will use for your system. In my current MSCA project, [Waste2Drug](https://sofki.github.io/waste-2-drug/) I use [acpype](https://acpype.readthedocs.io/en/latest/), a python-based tool that utilises [Antechamber](https://ambermd.org/antechamber/ac.html) and [ParmEd](https://parmed.github.io/ParmEd/html/index.html) in order to build ligand topologies using the GAFF or the OPLS forcefields and convert them to gromacs format. You will also need a local copy of your desired forcefield, in your working directory. If you are working in an HPC, it is advisable to use a conda-based installation of gromacs, so you'll be able to manipulate the ``residuetypes.dat`` file in the ``gromacs/top`` directory. However, if you do not need to add a covalently bonded ligand, this part is not necessary, so the HPC installation of gromacs is just fine. You will still however need to amke a local copy of the desired forcefiled, so you can change it.
