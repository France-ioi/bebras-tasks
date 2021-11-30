(** Usage: ocamlopt find.ml && ./a.out > out.txt *)
(** Arthur Charguéraud 2020, MIT License *)

(** library *)

let array_flatten ts =
  Array.concat (Array.to_list ts)

let disp t =
  Array.iter (fun v -> Printf.printf "%d, " v) t;
  Printf.printf "\n"


(** input *)

let finalStateGroupSizes =
  [| 4; 4; 3; 4 |] (* total: 15 *)

let nbShapes =
  Array.length finalStateGroupSizes

let finalState =
  let id = ref 0 in
  array_flatten (Array.map (fun n ->
    let t = Array.make n !id in
    incr id;
    t) finalStateGroupSizes)

let nbTotal =
  Array.length finalState

let _ =
  Printf.printf "Final state:\n";
  disp finalState

let rotate t iFirst iLast =
  let t = Array.copy t in
  let n = iLast - iFirst + 1 in
  for k = 0 to pred (n/2) do
    let a = iFirst + k in
    let b = iLast - k in
    let v = t.(a) in
    t.(a) <- t.(b);
    t.(b) <- v
  done;
  t


(** Algorithm *)

let goodMoves t =
  let moves = ref [] in
  for a = 1 to nbTotal-3 do
    for b = a+1 to nbTotal-2 do
      if t.(a) <> t.(b) && t.(a-1) = t.(b) && t.(a) = t.(b+1)
        then moves := (a,b)::!moves
    done
  done;
  !moves

let isFinalState t =
  (* identical shapes must be ajacents *)
  let nbChanges = ref 0 in
  let cur = ref t.(0) in
  for i = 1 to nbTotal-1 do
    if t.(i) <> !cur then begin
      incr nbChanges;
      cur := t.(i);
    end;
  done;
  (!nbChanges = nbShapes-1)

exception Stuck

let dispMoves moves =
   List.iter (fun (a,b) -> Printf.printf "(%d,%d); " a b) moves;
   Printf.printf "\n"

let trace =
  false

let count = ref 0

let rec checkGoodMovesLeadToSolution nbMovesLeft t =
  if nbMovesLeft = 0 then begin
    if not (isFinalState t)
      then raise Stuck
    else
      incr count
  end else begin
    let moves = goodMoves t in
    if trace then begin
      Printf.printf "Moves from:\n";
      disp t;
      dispMoves moves;
    end;
    if List.length moves = 0 then begin
      if trace then Printf.printf "Stuck on a state with no good moves.\n";
      raise Stuck
    end;
    List.iter (fun (a,b) ->
      if trace then Printf.printf "Execute (%d,%d)\n" a b;
      checkGoodMovesLeadToSolution (nbMovesLeft-1) (rotate t a b);
      if trace then Printf.printf "Executing (%d,%d) was ok.\n" a b) moves
  end


(* ---Comment out to test one particular solution

let rotations =
  [|(2,13); (3,12); (1,9); (4,11); (2,9); |]

let nbMovesSolution =
  Array.length rotations

let initState =
  Array.fold_left (fun t (a,b) ->
    let u = rotate t a b in
    if not (u.(a) <> u.(b) && u.(a-1) = u.(b) && u.(a) = u.(b+1)) then begin
       Printf.printf "Step (%d,%d) is not a good move." a b;
       exit 0
    end;
    Printf.printf "Step (%d,%d):\n" a b;
    disp u;
    u) finalState rotations

let _ =
  Printf.printf "Initial state:\n";
  disp initState;
  Printf.printf "\nChecking\n";
  begin try
    count := 0;
    checkGoodMovesLeadToSolution nbMovesSolution initState;
    Printf.printf "All %d sequences of good moves solve the problem.\n" !count;
  with Stuck ->
    Printf.printf "Find a sequence of good moves that got stuck.";
  end;
  exit 0
*)

(* ---Search for one rotation *)

exception Found of (int*int) list

let nbMovesSolution = 5

let goodMovesBackward t =
  let moves = ref [] in
  for a = 1 to nbTotal-3 do
    for b = a+1 to nbTotal-2 do
      if t.(a) <> t.(b) && t.(a-1) = t.(a) && t.(b) = t.(b+1)
        then moves := (a,b)::!moves
    done
  done;
  !moves

let dispTransitions moves t =
  ignore (List.fold_left (fun t (a,b) ->
    let u = rotate t a b in
    Printf.printf "Step (%d,%d):\n" a b;
    disp u;
    u) t moves)

let reportSolution moves countSolutions =
  (* Printf.printf "Found suitable rotations:\n";*)
  dispMoves moves;
  disp (List.fold_left (fun t (a,b) -> rotate t a b) finalState moves);
  Printf.printf "nb sol: %d\n" countSolutions;
  if trace then dispTransitions moves finalState

let hashtbl = Hashtbl.create 123456

let rec searchRotations movesSoFar nbMovesLeft t =
  if nbMovesLeft = 0 then begin
    if not (Hashtbl.mem hashtbl t) then begin
      Hashtbl.add hashtbl t true;
      try
        count := 0;
        checkGoodMovesLeadToSolution nbMovesSolution t;
        (* early termination: raise (Found (List.rev movesSoFar)) *)
        reportSolution (List.rev movesSoFar) !count
      with Stuck -> ()
    end
  end else begin
    let moves = goodMovesBackward t in
    List.iter (fun (a,b) -> searchRotations ((a,b)::movesSoFar) (nbMovesLeft-1) (rotate t a b)) moves
  end

let _ =
  begin try
    searchRotations [] nbMovesSolution finalState
  with Found moves ->
    reportSolution moves 0
  end

(* Printf.printf "Found no suitable rotations.\n" *)


