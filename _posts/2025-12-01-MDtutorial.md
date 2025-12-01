---
layout: post
title: Protein-Ligand complex MD tutorial
subtitle: A GROMACS tutorial for building a complex system with a metalloprotein, a cofactor and a ligand 
cover-img: 
thumbnail-img: https://sofki.github.io//assets/img/gmx.png
share-img: https://sofki.github.io//assets/img/gmx.png
tags: [tutorials, GROMACS. MD]
author: Sofia Kiriakidi
---

Building a complex system containing a protein (especially a metalloprotein) that contains small molecules that act aaas co-factors and a docked ligand can eb a very challenging procedure. In order to make things easier a created this tutorial using only free and open access resources, such as [Antechamber](https://ambermd.org/antechamber/ac.html), [acpype](https://alanwilter.github.io/acpype/) and [GROMACS](https://www.gromacs.org/).

This tutorial aspires to help each user that has to perform this difficult task in the future and therefore serve the community as a free educational resource. Nonetheless, it serves an additional role. It can be referenced as a public protocol for the system preparations of the short MD simulations that followed the docking of p-cymene into each target protein to assess the stability of the protein-ligand complex, for the **MSCA**-funded project [**_Waste2Drug_**](https://sofki.github.io/waste-2-drug/). In this way, the reproducibility of the results and the [Open Science](https://rea.ec.europa.eu/open-science_en) principles of the project is ensured.

This tutorial assumes that you already have a *prepared* protein and ligand file. Crystal structures deposited in RCSB may have a lot of problems, such as missing hydrogens, missing side-chains, even whole missing residues and protein loops. Moreover, the specific pH of the system that you want to simulate should be taken into account for the protonation of specific residues (such as histidines). Similar manipulations (especially taking care of the protonation) should be considered also for the ligand (and any cofactors that might be present and *important* for your system). Finally, anything present in the opdb that it is not relevant for your simulation (such as cocrystallized water molecules or additives) should be removed from the final, *prepared* structure.

For this project, I used the [Enalos Asclepios](https://novamechanics.com/products/asclepios-knime-nodes/) KNIME tools, developed by [NovaMechanics Ltd](https://novamechanics.eu/) for the protein and ligand preparation. An alternative that is free for academic use is [CHARMM-GUI](https://www.charmm-gui.org/). However, there are several either paid or free options that you may use for your system's preparation that are beyond the scope of this tutorial.

Moreover, prior to the MD simulations that will be described in this tutorial, the ligand, *p-cymene* was docked into the binding pocket of 50 possible target proteins. The coordinates that will be used for the ligand are the output of the docking calculation. Nevertheless, this tutorial may be generalised for any protein-metal-cofactor-ligand complex that one wants to simulate.

For this tutorial, you will also need an access to a machine where you can run the calculations (most probably an efficient machine with a Linux environment or access to an HPC). The parametrization of the ligands and teh cofactors doesn't need powerful computational resources. In my case, it was perfromed on a WSL (Windows Subsystem for Linux) on my laptop where I had set up a conda environment with Antechamber and acpype. A very useful tutorial on how to set up this environment can be found [here](https://www.youtube.com/watch?v=OrfOZ1wmElo).

### Part 1: Prepare Topologies

For this work, we will use the AMBER99SB forcefield for the protein and the General Amber ForceField (GAFF) for the ligands.

First we will need to separate the protein from the ligand and the cofactor in different structure files. The protein that we will use is the MAP2K1 (PDB ID: 3EQC), complexed with an ATP-analogue (ATP-γ-S), Mg<sup>2+</sup> and an inhibitor. The AMBER99SB forcefield contains the parametrs for all standard aminoacids and the Mg<sup>2+</sup> ion. We will also need to keep the ATP analogue that is the physiological ligand that activates MAP2K1 but we will discard the inhibitor, as we will use our ligand, p-cymene, that was docked in the inhibitor's pocket. In order to proceed, we need to have in different files the *prepared* apo proten structure (apo.pdb) that contains only standard residues and Mg<sup>2+</sup>, the ATP-analogue in .mol2 form (cofactor.mol2) and our ligand - here, the output of our docking study - again in .mol2 form (p-cymene.mol2).

1. We will first prepare the cofactor topology. In order to do so we will use the acpype code that calls Antechamber and yields small organic molecules GAFF topologies in gromacs format. In our linux environment we will do:
''''
acpype -i cofactor.mol2   
''''

1. 

