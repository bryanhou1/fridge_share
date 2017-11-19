class FridgeSerializer < ActiveModel::Serializer
  attributes :id, :name
  has_many :items
  has_many :fridge_comments, serializer: FridgeCommentSerializer
end
