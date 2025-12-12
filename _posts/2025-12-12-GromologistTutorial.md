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

Gromologist is working with python commands, so you may run python at your preferable way. I am working on an HPC, so I preferred the ``ipython`` environment. So let'start!

1. First create the local copy of the desired forcefield:
```
cp -r /usr/share/gromacs/top/amber99sb-ildn.ff .
```

2.  Then activate ipython (or use your preferred way of running python) and import the gromologist package:
```
import gromologist as gml
```

3. The next step is to load the topology that you externally created, e.g. with acpype:
```
 t = gml.Top('ligand_GMX.itp')
```

4.   And then add your new "residue" (for example, residue LIG for ligand) to your forcefields .rtp and .hdb databases (.hdb is updated automatically)
```
t.molecules[0].to_rtp('amber99sb.ff/aminoacids.rtp') 
```

5.  The next step is to update your forcefield's atomtypes.dat:
```
t.molecules[0].write_atomtypes('amber99sb.ff/atomtypes.dat')
```

6.  Now, if you have a .pdb file taht contains both your protein and ligand, namely system.pdb, you can run ``pdb2gmx`` as follows:
```
gmx pdb2gmx -f system.pdb -ighnh -ter
```

    Do not forget to choose the *local* copy of your forcefield, normally the selection 1.
    
7.  After this step, you will have a generated topol.top file. However, the file will be missing the atom types of your ligand. Although the gromologist actual tutorial suggested an automated way of doing it, I encountered some issues (might be my fault) but I figured that it is easier to copy the [atomtypes] directly from your ligand_GMX.itp and paste it in your topol.top file, right after the " Include forcefield parameters" section:
```
; Include forcefield parameters
#include "./amber99sb.ff/forcefield.itp"

[ atomtypes ]
;name   bond_type     mass     charge   ptype   sigma         epsilon       Amb
 nb       nb          0.00000  0.00000   A     3.38417e-01   3.93714e-01 ; 1.90  0.0941
 ca       ca          0.00000  0.00000   A     3.31521e-01   4.13379e-01 ; 1.86  0.0988
 nv       nv          0.00000  0.00000   A     3.36813e-01   4.68608e-01 ; 1.89  0.1120
 nc       nc          0.00000  0.00000   A     3.38417e-01   3.93714e-01 ; 1.90  0.0941
 cd       cd          0.00000  0.00000   A     3.31521e-01   4.13379e-01 ; 1.86  0.0988
 na       na          0.00000  0.00000   A     3.20581e-01   8.54373e-01 ; 1.80  0.2042
 p5       p5          0.00000  0.00000   A     3.69402e-01   9.60228e-01 ; 2.07  0.2295
 c5       c5          0.00000  0.00000   A     3.39771e-01   4.51035e-01 ; 1.91  0.1078
 o        o           0.00000  0.00000   A     3.04812e-01   6.12119e-01 ; 1.71  0.1463
 oh       oh          0.00000  0.00000   A     3.24287e-01   3.89112e-01 ; 1.82  0.0930
 os       os          0.00000  0.00000   A     3.15610e-01   3.03758e-01 ; 1.77  0.0726
 n7       n7          0.00000  0.00000   A     3.50765e-01   2.18405e-01 ; 1.97  0.0522
 c3       c3          0.00000  0.00000   A     3.39771e-01   4.51035e-01 ; 1.91  0.1078
 h5       h5          0.00000  0.00000   A     2.44730e-01   6.73624e-02 ; 1.37  0.0161
 hn       hn          0.00000  0.00000   A     1.10650e-01   4.18400e-02 ; 0.62  0.0100
 h2       h2          0.00000  0.00000   A     2.24382e-01   8.70272e-02 ; 1.26  0.0208
 h1       h1          0.00000  0.00000   A     2.42200e-01   8.70272e-02 ; 1.36  0.0208
 ho       ho          0.00000  0.00000   A     5.37925e-02   1.96648e-02 ; 0.30  0.0047
 ha       ha          0.00000  0.00000   A     2.62548e-01   6.73624e-02 ; 1.47  0.0161
 hc       hc          0.00000  0.00000   A     2.60018e-01   8.70272e-02 ; 1.46  0.0208

```

8.  Now we are ready to use gromologist for an automated system setup. We will utilise the ``prepare_system`` module where we can set a lot of defaults and let it run up to the energy minimization. For a detailed list of teh possible options check [this](https://gitlab.com/KomBioMol/gromologist/-/wikis/Automated-system-preparation). In my case, I used all the defaults, except adding the ``-neutral`` keyword in genion, in order to not only add 0.15M of KCL, but also all the extra ions needed to neutralise the system. You may see the defaults in the link provided above. So, again in an ipython environment we do:
```
gml.prepare_system('conf.gro', topology='topol.top', neutral='')
```
     Where conf.gro is the output of ``pdb2gmx`` of the previous step.

After a short while and if nothing fails, we will have a minimzed structure from where we can proceed with our usual equilibration protocol. 

