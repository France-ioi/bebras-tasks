open Scanf
open Printf
let ( ~~ ) = fun f x y -> f y x 
let ( ~~~ ) = fun f x y z -> f z y x 


let read_dico filename =
   let f = open_in filename in
   let n = fscanf f " %d" (fun x -> x) in
   let acc = ref [] in
   for i = 1 to n do
      let w = fscanf f " %s" (fun x -> x) in
      if String.length w = 4 then acc := w::!acc;
   done;
   close_in f;
   List.rev !acc

(* filter words of length 4 

let _ =
   let dico = read_dico "Dictionary.txt" in
   let g = open_out "Dictionary4.txt" in
   fprintf g "%d\n" (List.length dico);
   ~~ List.iter dico (fun w -> fprintf g "%s\n" w);
   close_out g

*)

let code c =
   let k = Char.code c - 65 in
   (k+1) mod 10
  
(* test code function
let _ = 
   for i = 0 to 25 do
     let c = Char.chr (65 + i) in 
     printf "%c -> %d\n" c (code c)
   done
*)

let _ = 
  let t = Array.create 10000 [] in
  let dico = read_dico "Dictionary4.txt" in
   let g = open_out "table.txt" in
  ~~ List.iter dico (fun w -> 
    let x = 1000 * code w.[0] + 100 * code w.[1] + 10 * code w.[2] + code w.[3] in
    t.(x) <- w :: t.(x););
  ~~ Array.iteri t (fun i ws ->
     if List.length ws > 0 then begin
        fprintf g "%d " i;
        ~~ List.iter ws (fun w -> fprintf g "%s " w);
        fprintf g "\n"
        end);
   close_out g

