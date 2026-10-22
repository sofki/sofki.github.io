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

The image below ([source](https://link.springer.com/article/10.1186/s13321-024-00812-5?utm_source=rct_congratemailt&utm_medium=email&utm_campaign=oa_20240221&utm_content=10.1186%2Fs13321-024-00812-5)) shows the different funcionalities of REINVENT4. It uses TOML or JSON files as inputs, along with SMILES files when necessary. It offers different run modes, working with combined Reinforcement/Curriculum staged Learning or Transfer Learning and uses Sampling to generate molecules based on the results of the model produced by either mode of Learning, while it finally uses Scoring to score the generated molecules based on user-defined criteria.

![reinventdiagram](https://sofki.github.io//assets/img/REINVENT.png)

In **Reinforcement / Curriculum (Staged) Learning** a pretrained generative model is fine-tuned by sampling candidate molecules, scoring them against the design criteria, and updating the model so that high-scoring structures become more likely — a reward-driven search rather than imitation of a fixed dataset. Because a multi-component objective (similarity to the seed molecule, physicochemical filters, docking) is hard to satisfy all at once, the reward is introduced in stages: the model first learns the easy, cheap criteria, and each stage’s model initialises the next, with harder and more expensive terms switched on progressively until the full objective is active.

In **Transfer Learning** a model trained on a large, general corpus — here a ChEMBL-wide set of bioactive molecules — is reused as the starting point for a narrower task instead of being trained from scratch. The general model supplies the broadly useful knowledge (valid SMILES syntax, drug-like chemistry, common scaffolds and functional groups), and fine-tuning on a small focused set, such as known inhibitors of the target or analogues of the seed molecule, biases generation toward that chemical space. This makes the narrow task learnable from a few hundred or few thousand examples, far fewer than training from zero would require. In this project, due to the very limited data (only 13 known inhibitors) we used the first approach for learning. 

The next step is to decide which of the available generarors we will use. REINVENT4 offers four different types of generators, *Reinvent* where completely *de novo* atom-by-atom generation takes place, *Libinvent* where one may provide a seed molecule and build a library of derivatives with scaffold decoration, *Linkinvent* where two "warheads" are supplied for scaffold linking and the generator produces suitable linkers and *Mol2Mol* where a seed molecule is supplied as a restraint and the generator seeks to provide with similar molecules. For *Waste2Drug*, we want to produce derivatives (and not just similar molecules) of p-cymene, so the most appropriate approach was to use the *Libinvent* generator.

Finally, we have to set some scoring criteria, relevant to our project. For *Waste2Drug*, we used the following usual cirteria for drug design:
* **SMARTS alerts:** large rings (synthetically difficult), peroxide bond (highly reactive, metabolically unstable, ROS generation cytotoxic), charged carbon (unstable), disulfide bond (highly reactive, metabolically unstable, unselective adducts with CYS), hydrazine bond(hepatotoxic) - groups to avoid for known problems related to druggability
* **rotatable bonds < 10**
* **stereogenic centers < 2**
* **350 < Mw < 600**
* **logP <= 5**
* **TPSA <=150** (The Topological Polar Surface Area measures the surface area of a molecule's polar atoms -primarily oxygen and nitrogen, including attached hydrogens- and it is a tool for predicting a drug's cell permeability, oral absorption, and bioavailability)
* aromatic rings < 5
* **Cl(<=1),F(<4)**
* **HB donors < 5, acceptors < 10**
* **Docking Score**

The last criterium is the most complicated technically, since it forces us to use Maize combined with Autodock-GPU, instead of just the REINVENT4 code. However, it is the one that makes our model target-specific, as it takes into account the docking score of the generated molecule into the target in question, and if the score is very low, the molecule is rejected (it can be a perfect drug molecule but for another target). It is worth noting that the user can adjust the weights of the criteria and choose what matters most for their project.

Now let's go to the practical part! Assuming you have a working conda environment with Maize, REINVENT and Autodock-GPU, you should start by moving these configuration files at your working directory:

* [stage2.toml](https://github.com/sofki/scripts/blob/main/DrugDesign/stage2.toml)
* [stage2_scoring.toml](https://github.com/sofki/scripts/blob/main/DrugDesign/stage2_scoring.toml)
* [scaffolds.smi](https://github.com/sofki/scripts/blob/main/DrugDesign/scaffolds.smi)

examples for both of which can be found in the [REINVENT github page](https://github.com/MolecularAI/REINVENT4/tree/main/contrib/tutorials/maize/Libinvent/6G5J_vs_8ZYP) and should be modified accordingly to fit your own project. The ones that were used for *Waste2Drug* are also provided above for reference.

Let's now inspect both of the files and discuss what they do and what needs to be changed for your own setup.

**staged2.toml:** 

(comments are added for explanation)

```
run_type = "staged_learning" #chooses the run mode, other options are "sampling", "scoring", "transfer_learning"
device = "cpu"  #the device was changeds to cpu instead of cuda:0 because I ran it in the cpu of my laptop, change accordingly
tb_logdir = "tb_stage2" #creates a directory for TensorBoard event files
json_out_config = "_stage2.json" #name of the json output file

[parameters]

use_checkpoint = true #if it is the first run, set it to false, if you continue from a previous checkpoint, set it to true

prior_file = "libinvent.prior" #choose the appropriate file for the generator that you want to use (reinvent, libinvent, linkinvent, mol2mol).The priors can be found at your local REINVENT4 directory (created when you download the git repository in order to install REINVENT4) in ~/REINVENT4/priors/. Remember to put the whole path if it is not in the same directory as your toml files.
agent_file = "stage2.chkpt" #if it is your first run, put the prior file, otherwise use the checkpoint that you jsut wrote from your previous run
smiles_file = "scaffolds.smi" #if you want to run a Libinvent model, you need to provide a scaffolds file, where the model will get the information on the changes you want to make to your seed molecule. This file will explained in detail later on

summary_csv_prefix = "stage2" #prefix for the csv files that will be produced

batch_size = 10 # Molecules sampled per RL step. Small batches mean noisier updates but far fewer docking calls per step
randomize_smiles = true # Present the input scaffold/SMILES to the network in a randomly permuted but chemically equivalent form each time it is used. Acts as data augmentation: it stops the agent from latching onto one particular string representation and generally improves the diversity and validity of what it generates.

[learning_strategy]
# How the agent is updated from the reward.
type = "dap" # The update rule. "dap" is the REINVENT default and the best-tested option;
sigma = 128 #Weight of the score relative to the prior. Higher sigma chases the reward harder but drifts further from the prior and collapses onto fewer scaffolds; lower sigma keeps diversity but learns slowly. 60-128 is the usual range.
rate = 0.0001 # Learning rate of the Adam optimizer for the agent's weights. Separate from sigma: sigma sets how far the target moves, rate sets how fast the network chases it.


[diversity_filter]
# Discourages the agent from re-proposing molecules it has already seen, which is the main defence against mode collapse.

type = "PenalizeSameSmiles"  # Filter variant. "PenalizeSameSmiles" acts on exact repeats.
penalty_multiplier = 0.2 # Score multiplier applied on each repeat: 0.2 cuts a duplicate's score to a fifth. 


[inception]
# Keeps a buffer of the best-scoring molecules seen so far and replays them
# into the loss, so good hits keep teaching after the step that found them.

memory_size = 50 # How many top molecules the buffer holds.
sample_size = 10 # How many are drawn from the buffer and added to each batch's loss.


[[stage]]
termination = "simple" 
# Termination rule. "simple" stops when the mean score of a batch reaches
# max_score, or when max_steps is exhausted — whichever comes first.

max_score = 1.0 #perfect score
max_steps = 140 #number of steps

chkpt_file = 'stage2.chkpt' # Where the trained agent is written when the stage ends (or is interrupted). A later stage loads this as its agent_file — this is the link between stages.

[stage.scoring]

type = "geometric_mean" # Aggregation function. "geometric_mean" multiplies the weighted component scores, so a near-zero in any one component drags the total down — every criterion must be satisfied. "arithmetic_mean" lets a strong component compensate for a weak one.

filename = "stage2_scoring.toml" #now the files calls the second configuration file that you moved
#into the working directory. We'll see its components next.

```

Before moving to the second configuration file, let's see the **scaffolds.smi**:

```
[*:0]c1ccc(C(C)C)cc1
Cc1ccc(C(C)[*:0])cc1
Cc1c([*:0])cc(C(C)C)cc1
Cc1cc([*:0])c(C(C)C)cc1
Cc1c(cc(C(C)C)c([*:0])c1)
Cc1c([*:0])c(C(C)C)ccc1
Cc1ccc(C([*:0])([*:0]))cc1
[*:0]c1ccc(C(C)[*:0])cc1
[*:0]c1ccc(C([*:1])C)cc1
Cc1ccc([*:0](C)[*:1])cc1
Cc1ccc(C([*:0])([*:0]))c([*:0])c1
[*:0]c1c([*:0])cc(C(C)C)c([*:0])c1
[*:0]c1c([*:0])cc(C([*:1])C)cc1
Cc1ccc([*:0](C)[*:1])c([*:0])c1
[*:0]c1c([*:1])cc(C([*:2])C)cc1
Cc1ccc([*:0](C)[*:0])c([*:1])c1
Cc1ccc([*:1](C)[*:0])c([*:0])c1
Cc1ccc([*:1](C)[*:1])c([*:0])c1
Cc1ccc([*:1](C)[*:0])c([*:1])c1
Cc1ccc([*:0](C)[*:1])c([*:1])c1
```
It contains a list of smiles, where a wildcart placement ```[*:0]``` has been put on the atom (p-cymene carbon in this case) that we want to substitute. In case where more than one substitution is desired, a second wildcart ```[*:1]``` can be put. The *Libinvent* algorithm will now create p-cymene dervatives by substititing on the positions that we defined in the ```scaffolds.smi```.

As we saw before, the final stage of ```stage2.toml``` is to call the scoring configuration file, ```stage2_scoring.toml```, which includes the scoring criteria that we chose to impose for our project. Let's inspect it:

**staged2_scoring.toml:**
(comments are added for explanation)

```
[[component]]

# in this part we include the SMARTS alerts previously described

[component.custom_alerts]
[[component.custom_alerts.endpoint]]
name = "Minimal Alerts"

[component.custom_alerts.endpoint.params]
smarts = ["[*;r{8-17}]", "[#8][#8]", "[#6;+]", "[#16][#16]", "[#7;!n][#7;!n]"]


[[component]]

#in this part, we impose a maxixum number of rotable bonds
[component.NumRotBond]
[[component.NumRotBond.endpoint]]
name = "# rotatable bonds (<10)"
weight = 1

[component.NumRotBond.endpoint.transform]
low = 6
high = 14
k = 0.25
type = "reverse_sigmoid" #means lower is better


[[component]]

#here a maximum number of stereo centers is set

[component.NumAtomStereoCenters]
[[component.NumAtomStereoCenters.endpoint]]
name = "# stereo centers (<2)"
weight = 1

[component.NumAtomStereoCenters.endpoint.transform]
low = 0
high = 2
k = 0.25
type = "reverse_sigmoid"


[[component]]

#here we set the range of preferred molecular weights

[component.molecular_weight]
[[component.molecular_weight.endpoint]]
name = "Molecular weight (350-600)"
weight = 1

[component.molecular_weight.endpoint.transform]
low = 300
high = 650
coef_div = 500
coef_si = 20
coef_se = 20
type = "double_sigmoid" #It’s built as the difference of two rising sigmoids — one centered at low, one at high. Subtracting the second from the first carves out a plateau in between, so the curve rises from 0, flattens near 1, then falls back to 0.


[[component]]

#we set logP <=5 to control the lipophilicity of the suggested molecules

[component.SlogP]
[[component.SlogP.endpoint]]
name = "logP (<=5)"
weight = 1

[component.SlogP.endpoint.transform]
low = 0
high = 8
k = 0.25
type = "reverse_sigmoid"


[[component]]

#we set the Topological Polar Surface Area
[component.tpsa]
[[component.tpsa.endpoint]]
name = "TPSA (<=150)"
weight = 1

[component.tpsa.endpoint.transform]
low = 125
high = 200
k = 0.25
type = "reverse_sigmoid"


[[component]]

#set the number of aromatic bonds

[component.NumAromaticRings]
[[component.NumAromaticRings.endpoint]]
name = "# aromatic rings (<5)"
weight = 1

[component.NumAromaticRings.endpoint.transform]
low = 4
high = 5
k = 0.25
type = "reverse_sigmoid"


[[component]]

#in the following components we set maximum numbers of certain groups

[component.GroupCount]
[[component.GroupCount.endpoint]]
name = "# Cl (<=1)"
weight = 1

[component.GroupCount.endpoint.params]
smarts = "[Cl]"
[component.GroupCount.endpoint.transform]
low = 1
high = 3
k = 0.5
type = "reverse_sigmoid"


[[component]]

[component.GroupCount]
[[component.GroupCount.endpoint]]
name = "# F (<4)"
weight = 1

[component.GroupCount.endpoint.params]
smarts = "[F]"
[component.GroupCount.endpoint.transform]
low = 3
high = 4
k = 0.5
type = "reverse_sigmoid"


[[component]]

#set maximum number of Hydrogen-Bond Donors

[component.HBondDonors]
[[component.HBondDonors.endpoint]]
name = "# HB-donors (<5)"
weight = 1

[component.HBondDonors.endpoint.transform]
low = 3
high = 7
k = 0.5
type = "reverse_sigmoid"


[[component]]

#set maximum number of Hydrogen-Bond Acceptors

[component.HBondAcceptors]
[[component.HBondAcceptors.endpoint]]
name = "# HB-acceptors (<10)"
weight = 1

[component.HBondAcceptors.endpoint.transform]
low = 6
high = 14
k = 0.25
type = "reverse_sigmoid"


[[component]]
[component.Maize]

#Now we have to use Maize to call AutodockGPU and run the doking calculation, in order to include the Docking Score as a Scoring Function

[[component.Maize.endpoint]]
name = "AutoDockGPU"
weight = 5 #we set a higher weight because it is more important to be a suitable ligand for the specific target

[component.Maize.endpoint.params]
executable = "/home/sofki/miniconda3/envs/reinvent4/bin/maize" #you should include where the executable for maiz is to be found, it will be in a similar path inside your conda environment
workflow = "/home/sofki/REINVENT4/contrib/tutorials/maize/autodock_gpu.yaml" #this file is provided in the tutorials section of the REINVENT and a local copy can be found in a similar path at your local version of the REINVENT github page, you downloaded ot as the first step for the installation
config = "/home/sofki/REINVENT4/contrib/tutorials/maize/maize_global_config.toml" #as above
log = "maize_adg.log"
debug = false

[component.Maize.endpoint.transform]
high = -5.0
low = -15.0
k = 0.3
type = "reverse_sigmoid"

[component.Maize.endpoint.params.parameters]
grid_file = "receptor.maps.fld"  # Autodock GPU gridfile must be present in your working directory. Will be discussed below
save_best_pose_file = "poses/best_pose.sdf" #set a directory where the best docking poses will be saved after each run
```

Now let's discuss the maize configuration files that are called inside the ```stage2_scoring.toml``` file.

First, the ``` autodock_gpu.yaml```, which is a maize workflow definition: a graph of nodes that takes SMILES in and returns docking scores. REINVENT invokes it through the Maize scoring component. You do not need to change anything in this file.

Now, let's move to the ```maize_global_config.toml```. This files tells maize where to find the executables that is goining to use. You need to change the paths accordinlgy to your machine. Some examples are:

```
scratch = "/home/sofki/.cache/maize"
#a scratch folder for temporary files, you need to set or create it

# Default SLURM options (not needed if you do not run at an HPC)                                                                                                  [batch]
queue = "default"
walltime = "12:00:00"
max_jobs = 12

....

[autodockgpu]  # needed for tutorial
commands.autodock_gpu = "/home/sofki/AutoDock-GPU/bin/autodock_gpu_128wi" #you should set the actual path for your local autodock_gpu installation
```

The rest of the settings will not be needed for this tutorial, but in case you use any of these extra software, you will need to set the paths correctly.

Now before we actually run the workflow, we need to have the docking grid files ```receptor.maps.fld``` in our working directory. You can do this directly with Autodock_GPU but I prefer to use AutoDockTools (ADT) so I can inspect my grid box through the Graphical User Interface. After saving the receptor.gpf file created in ADT, you should have the ```receptor.pdbqt``` and ```reflig.pdb``` files in the same directory where you will run the following command:

```
autogrid4 -p receptor.gpf -l receptor.glg
```

This will create all the files (including .maps.fld) taht maize will need in order to run the docking with AutoDockGPU.

In summary, before actually running the workflow, the following should be present at your wokring directory:

* stage2.toml
* stage2_scoring.toml
* scaffolds.smi
* receptor.maps.fld (and all the maps files that it created)
* a directory named ``poses``
* the .prior and/or .chkpt files

We are finally ready to run the actual Generative AI Drug Design Workflow:
                                                                
```
reinvent -l stage2_scoring.log stage2.toml
```

After a while (could be a couple of hours depending on your machine), .sdf files will start to appear inside the ``poses`` folder. We can even stop the run at some point, as a stage2.chkpt file will be written and the run can then be continued from this checkpoint file. Let's investigate our results, after 25 epochs of ML-generated p-cymene derivatives.

To do so, we will use the following jupyyer notebook files:

* [filter.ipynb](https://github.com/sofki/scripts/blob/main/DrugDesign/filter.ipynb)
* [Analyses.ipynb]((https://github.com/sofki/scripts/blob/main/DrugDesign/Analyses.ipynb))

We will first start with the filtering. From the total of 5200 molecules generated, we will first filter to keep only the valid and parseable SMILES, which will land us on 2889 molecules.

![filter1](https://sofki.github.io//assets/img/filter1.png)

Then, we will remove duplicates and put some threshold criteria, so we will see only the interesting molecules, which will leave us with only 15 molecules:

![filter2](https://sofki.github.io//assets/img/filter2.png)

After saving the unique molecules, we will create a .csv file that matches each entro to the relevant .sdf file so we can find it and access it later:

![filter3](https://sofki.github.io//assets/img/filter3.png)
![filter4](https://sofki.github.io//assets/img/filter4.png)




