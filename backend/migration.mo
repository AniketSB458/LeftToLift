import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Int "mo:core/Int";
import Float "mo:core/Float";
import Time "mo:core/Time";

module {
  type DonationStatus = {
    #pending;
    #accepted;
    #rejected;
    #confirmed;
    #pickedUp;
  };

  type StorageCondition = {
    #refrigerated;
    #roomTemperature;
    #hotStorage;
  };

  type FoodDonation = {
    id : Nat;
    donorName : Text;
    foodType : Text;
    quantity : Float;
    unit : Text;
    cookTime : Time.Time;
    storageCondition : StorageCondition;
    city : Text;
    neighborhood : Text;
    latitude : Float;
    longitude : Float;
    status : DonationStatus;
    claimedBy : ?Nat;
    timestamp : Time.Time;
  };

  type NGO = {
    id : Nat;
    name : Text;
    city : Text;
    neighborhood : Text;
    latitude : Float;
    longitude : Float;
    capacity : Nat;
    rating : Float;
    ratingCount : Nat;
  };

  type Volunteer = {
    id : Nat;
    name : Text;
    city : Text;
    latitude : Float;
    longitude : Float;
    availability : Text;
    rating : Float;
  };

  type ImpactCounters = {
    totalMealsSaved : Nat;
    totalPeopleFed : Nat;
    co2Reduced : Float;
    cityBreakdown : [(Text, Nat)];
  };

  type Rating = {
    id : Nat;
    donorId : Principal.Principal;
    rating : Float;
  };

  type NGOWithRatings = {
    ngo : NGO;
    ratings : Map.Map<Nat, Rating>;
  };

  type OldUserProfile = {
    name : Text;
    city : Text;
    neighborhood : Text;
    role : Text;
  };

  type OldActor = {
    foodDonations : Map.Map<Nat, FoodDonation>;
    ngos : Map.Map<Nat, NGOWithRatings>;
    volunteers : Map.Map<Nat, Volunteer>;
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
    impactCounters : ImpactCounters;
    nextDonationId : Nat;
    nextNgoId : Nat;
    nextVolunteerId : Nat;
    nextRatingId : Nat;
  };

  type EntityType = {
    #hotel;
    #ngo;
    #volunteer;
    #admin;
  };

  type NewUserProfile = {
    name : Text;
    city : Text;
    neighborhood : Text;
    entityType : EntityType;
  };

  type NewActor = {
    foodDonations : Map.Map<Nat, FoodDonation>;
    ngos : Map.Map<Nat, NGOWithRatings>;
    volunteers : Map.Map<Nat, Volunteer>;
    userProfiles : Map.Map<Principal.Principal, NewUserProfile>;
    impactCounters : ImpactCounters;
    nextDonationId : Nat;
    nextNgoId : Nat;
    nextVolunteerId : Nat;
    nextRatingId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal.Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          name = oldProfile.name;
          city = oldProfile.city;
          neighborhood = oldProfile.neighborhood;
          entityType = #hotel;
        };
      }
    );
    {
      old with userProfiles = newUserProfiles;
    };
  };
};
